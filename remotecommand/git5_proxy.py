#!/usr/bin/python
import SimpleHTTPServer
import BaseHTTPServer
import subprocess
import time
import urllib
from urlparse import urlparse

# Remote invoke local shell script through web site.
# You can use other people right to run shell script.

#change me
PORT = 10080
shell_path = "./shellscript/"

#store temp data(log, cache) in memory.
#TODO(caihuo): add file store in local.
class StoreLogCache():
    __log_size = 10;

    def __init__(self):
        self.__log = []

    def log(self, info):
        if len(self.__log) >= self.__log_size:
            del self.__log[0]
        self.__log.append(info)

    def toString(self):
        result = ""
        #(caihuo): for invert sequence of print list.
        idx = len(self.__log)
        for log in self.__log:
            idx = idx - 1
            result += self.__log[idx] + "</br>"
        return result

    def toJSONString(self):
        result = ""
        split_flag = 0
        for data in self.__log:
            if split_flag:
                result += ","
            result += data
            split_flag = 1 
        return result

#log
sync_time = " none"
push_log = StoreLogCache()
desc_store = StoreLogCache()

#HTTP server
class GitSubmitHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
    #handle HTTP request.
    def do_GET(self):
        try:
            resp = """<html><head><title>git web tool</title></head>
            <script type="text/javascript">
            var content = {""" + desc_store.toJSONString() + """};
            function check(){
                var val = document.getElementById("s").value;
                var desc = document.getElementById("d").value;
                if(val == null || val.length <= 0){
                    alert("The branch name cannot be null!");
                    return false;
                }
                if(desc == null || desc.length <= 0){
                    alert("The descritpion input cannot be null!");
                    return false;
                }
                if(confirm("Do you want to submit infomation?" + val + desc)){
                    content[val] = desc;
                    window.content = content;
                    //console.log("check = " + JSON.stringify(window.content));// Not support IE6/IE7.
                    return true;
                }else{
                    return false;
                }
            }
            
            function assistant(field){
                //console.log("assistant = " + JSON.stringify(window.content));// Not support IE6/IE7.
                if (field == null || field.value.length <= 0)
                    return null;
                var desc = document.getElementById("d");
                if (window.content[field.value] != null && 
                  window.content[field.value].length > 0 && desc.value.length <= 0){
                    document.getElementById("d").value=window.content[field.value];
                }
            }
            
            function sendmail(){
                if (check()){
                    document.form1.action='/mail?get=beyond';
                    document.form1.method='get';
                    //document.createElement('form').submit.call(form1);
                    document.form1.submit();
                    disablebutton();
                }
            }
            
            function pushcl(){
                if (check()){
                    document.form1.action='/push?get=beyond';
                    document.form1.method='get';
                    //document.createElement('form').submit.call(form1);
                    document.form1.submit();
                    disablebutton();
                }
            }

            function disablebutton(){
                var objs = document.getElementsByTagName("input")
                for (var i=0; i<objs.length; i++ ){
                    objs[i].disabled=true;
                }
            }
            </script>
            <body><div style='text-align:left;'>
            """
            self.send_response(200)
            self.send_header("Content_type","text/html")
            self.end_headers()
            if self.path.endswith("/"):
                global sync_time
                resp += """<h3>The git submit tool, command include:</h3>
                <table>
                <tr><td>
                To sync code from google3.</br></td>
                <td><form name='sync' action='/sync' method='get' onsubmit='if(confirm("Do you want to sync now?")){
                disablebutton();return true;}else{return false;}'>
                <input id='sync' type='submit' value='sync'/></td><td>last sync time: %s</form></td></tr>
                <tr></tr>
                <tr><td>
                Upload the branch(change-list) to git5(google3). <br/><b>MUST input branch name.</b><br/>
                </td>
                <td><form name='form1' action='/push' method='post' >
                Branch Name : <input type='text' id='s' name='s' maxlength=50 size=30 onblur='assistant(this)'/>
                <input id='push' type='button' value='push' onclick='pushcl()'/></br>
                Descripton : <input type='text' id='d' name='d' maxlength=100 size=30 />
                <input id='mail' type='button' value='mail' onclick='sendmail()'/></form></td></tr>
                <tr></tr>
                </table>
                """ % sync_time
                oplog = push_log.toString()
                if len(oplog)>0:
                    resp = resp + "Operation Log: </br><div>" + oplog + "</div>"
            else:
                resp += self.getResp()
            resp += """</div><a href="http://validator.w3.org/check?uri=referer"><img
                src="http://www.w3.org/Icons/valid-xhtml10" alt="Valid XHTML 1.0 Strict" height="31" width="88" />
                </a></body></html>"""
            self.wfile.write(resp)
        except IOError:
            self.send_error(404, "to see: %s" % self.path)

    #handle request http address, and set response.
    def getResp(self):
        resp = "<textarea rows='30' cols='80' readonly='yes'>"
        cmd_array = []
        if self.getURLMethod() == "sync":
            global sync_time
            cmd_array = [shell_path + "sync_upstream.sh"]
            resp += runCommand(cmd_array + self.getURLParameter())
            sync_time = time.strftime("%Y/%m/%d %X", time.localtime())
        elif self.getURLMethod() == "push":
            cmd_array = [shell_path + "send_cl.sh"]
            resp += self.runAndResponse(cmd_array)
        elif self.getURLMethod() == "mail":
            cmd_array = [shell_path + "export_mail.sh"]
            resp += self.runAndResponse(cmd_array)
        resp += "</textarea><div align='center'><a href='/'>retrun</a></div>"
        return resp

    def runAndResponse(self, cmd_array):
        resp = ""
        params = self.getURLParameters()
        if len(params) == 2:
            params[1] = "\"" + params[1] + "\""
            resp += runCommand(cmd_array + params)
            push_time = time.strftime("%Y/%m/%d %X", time.localtime())
            push_log.log(push_time + " : " + params[0] + " : " + params[1])
            desc_store.log("\"" + params[0] + "\"" + ":" + params[1])
        else :
            resp += "the input prameter number ERROR!!!!"
        return resp

    def getURLMethod(self):
        paraidx = self.path.rfind('?')
        result = ""
        if paraidx > 0:
            result = self.path[self.path.rindex('/') + 1: paraidx]
        else:
            result = self.path[self.path.rindex('/') + 1:]
        return result

    def getURLParameter(self):
        paraidx = self.path.rfind('=')
        if paraidx < 0:
            return [""]
        decode_url = urllib.unquote_plus(self.path[paraidx + 1:])
        return decode_url.strip().split("|")

    def getURLParameters(self):
        idx = self.path.rfind('?')
        result = []
        if idx < 0:
            return result.append("")
        para_url = self.path[idx + 1:]
        for para in para_url.strip().split("&"):
            edx = para.rfind('=')
            if edx > 0:
                result.append(urllib.unquote_plus(para[edx + 1:]))
        return result

# Run loacl shell command.
def runCommand(exe):
    p = subprocess.Popen(exe, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    result = "";
    while(True):
        retcode = p.poll()
        line = p.stdout.readline()
        result += line
        if (retcode is not None):
            break
    return result

def startServer():
    server_address = ("", PORT)
    httpd = BaseHTTPServer.HTTPServer(server_address, GitSubmitHandler)
    httpd.serve_forever()

if __name__ == "__main__":
    print "start server, port", PORT
    startServer()
