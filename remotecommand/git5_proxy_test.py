#!/usr/bin/python
from git5_proxy import StoreLogCache

def testLog():
	print "start test git5"
	sync_log = StoreLogCache()
	sync_log.log("sync_log,xxxxbranch-name, 19238382:12:12")
	sync_log.log("sync_log,weigang_refactor, 2012/2/11 19:22:11")
	push_log = StoreLogCache()
	push_log.log("1xxxx, 192/2390")
	push_log.log("2sjids, fds")
	push_log.log("3xxxx, 192/2390")
	push_log.log("4sjids, fds")
	push_log.log("5xxxx, 192/2390")
	push_log.log("6sjids, fds")
	push_log.log("7xxxx, 192/2390")
	push_log.log("8sjids, fds")
	sync_log.log("sync_log,fdsak,fd0129103210")
	print push_log.toString()
	print sync_log.toString()

if __name__ == "__main__":
	testLog()
