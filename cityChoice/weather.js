/**
* weather wedget script
* @auther weigangqiu@
**/

goog.require("goog.dom");
goog.require("goog.events");
goog.require("goog.events.EventTarget");
goog.require("goog.net.XhrIo");
goog.require('goog.ui.INLINE_BLOCK_CLASSNAME');

// eg. [[[1,"beijing"], [[10100101,"beijing"],[...]],[[2,"shanghai"],[101010102,"shanghai"]...]
var regions = [[["1", "\u5317\u4eac"], [["101010100", "\u5317\u4eac"]]], [["2", "\u4e0a\u6d77"], [["101020100", "\u4e0a\u6d77"]]], [["3", "\u5929\u6d25"], [["101030100", "\u5929\u6d25"]]], [["4", "\u91cd\u5e86"], [["101040100", "\u91cd\u5e86"]]], [["5", "\u9ed1\u9f99\u6c5f"], [["101050101", "\u54c8\u5c14\u6ee8"], ["101050201", "\u9f50\u9f50\u54c8\u5c14"], ["101050301", "\u7261\u4e39\u6c5f"], ["101050401", "\u4f73\u6728\u65af"], ["101050501", "\u7ee5\u5316"], ["101050601", "\u9ed1\u6cb3"], ["101050701", "\u5927\u5174\u5b89\u5cad"], ["101050801", "\u4f0a\u6625"], ["101050901", "\u5927\u5e86"], ["101051002", "\u4e03\u53f0\u6cb3"], ["101051101", "\u9e21\u897f"], ["101051201", "\u9e64\u5c97"], ["101051301", "\u53cc\u9e2d\u5c71"]]], [["6", "\u5409\u6797"], [["101060101", "\u957f\u6625"], ["101060201", "\u5409\u6797"], ["101060301", "\u5ef6\u5409"], ["101060401", "\u56db\u5e73"], ["101060501", "\u901a\u5316"], ["101060601", "\u767d\u57ce"], ["101060701", "\u8fbd\u6e90"], ["101060801", "\u677e\u539f"], ["101060901", "\u767d\u5c71"]]], [["7", "\u8fbd\u5b81"], [["101070101", "\u6c88\u9633"], ["101070201", "\u5927\u8fde"], ["101070301", "\u978d\u5c71"], ["101070401", "\u629a\u987a"], ["101070501", "\u672c\u6eaa"], ["101070601", "\u4e39\u4e1c"], ["101070701", "\u9526\u5dde"], ["101070801", "\u8425\u53e3"], ["101070901", "\u961c\u65b0"], ["101071001", "\u8fbd\u9633"], ["101071101", "\u94c1\u5cad"], ["101071201", "\u671d\u9633"], ["101071301", "\u76d8\u9526"], ["101071401", "\u846b\u82a6\u5c9b"]]], [["8", "\u5185\u8499\u53e4"], [["101080101", "\u547c\u548c\u6d69\u7279"], ["101080201", "\u5305\u5934"], ["101080301", "\u4e4c\u6d77"], ["101080401", "\u96c6\u5b81"], ["101080501", "\u901a\u8fbd"], ["101080601", "\u8d64\u5cf0"], ["101080701", "\u9102\u5c14\u591a\u65af"], ["101080801", "\u4e34\u6cb3"], ["101080901", "\u9521\u6797\u6d69\u7279"], ["101081000", "\u547c\u4f26\u8d1d\u5c14"], ["101080510", "\u9ad8\u529b\u677f"], ["101081201", "\u963f\u5de6\u65d7"]]], [["9", "\u6cb3\u5317"], [["101090101", "\u77f3\u5bb6\u5e84"], ["101090201", "\u4fdd\u5b9a"], ["101090301", "\u5f20\u5bb6\u53e3"], ["101090402", "\u627f\u5fb7"], ["101090501", "\u5510\u5c71"], ["101090601", "\u5eca\u574a"], ["101090701", "\u6ca7\u5dde"], ["101090801", "\u8861\u6c34"], ["101090901", "\u90a2\u53f0"], ["101091001", "\u90af\u90f8"], ["101091101", "\u79e6\u7687\u5c9b"]]], [["10", "\u5c71\u897f"], [["101100101", "\u592a\u539f"], ["101100201", "\u5927\u540c"], ["101100301", "\u9633\u6cc9"], ["101100401", "\u664b\u4e2d"], ["101100501", "\u957f\u6cbb"], ["101100601", "\u664b\u57ce"], ["101100701", "\u4e34\u6c7e"], ["101100801", "\u8fd0\u57ce"], ["101100901", "\u6714\u5dde"], ["101101001", "\u5ffb\u5dde"], ["101101100", "\u5415\u6881"]]], [["11", "\u9655\u897f"], [["101110101", "\u897f\u5b89"], ["101110200", "\u54b8\u9633"], ["101110300", "\u5ef6\u5b89"], ["101110401", "\u6986\u6797"], ["101110501", "\u6e2d\u5357"], ["101110601", "\u5546\u6d1b"], ["101110701", "\u5b89\u5eb7"], ["101110801", "\u6c49\u4e2d"], ["101110901", "\u5b9d\u9e21"], ["101111001", "\u94dc\u5ddd"], ["101111101", "\u6768\u51cc"]]], [["12", "\u5c71\u4e1c"], [["101120101", "\u6d4e\u5357"], ["101120201", "\u9752\u5c9b"], ["101120301", "\u6dc4\u535a"], ["101120401", "\u5fb7\u5dde"], ["101120501", "\u70df\u53f0"], ["101120601", "\u6f4d\u574a"], ["101120701", "\u6d4e\u5b81"], ["101120801", "\u6cf0\u5b89"], ["101120901", "\u4e34\u6c82"], ["101121001", "\u83cf\u6cfd"], ["101121101", "\u6ee8\u5dde"], ["101121201", "\u4e1c\u8425"], ["101121301", "\u5a01\u6d77"], ["101121401", "\u67a3\u5e84"], ["101121501", "\u65e5\u7167"], ["101121601", "\u83b1\u829c"], ["101121701", "\u804a\u57ce"]]], [["13", "\u65b0\u7586"], [["101130101", "\u4e4c\u9c81\u6728\u9f50"], ["101130201", "\u514b\u62c9\u739b\u4f9d"], ["101130301", "\u77f3\u6cb3\u5b50"], ["101130401", "\u660c\u5409"], ["101130501", "\u5410\u9c81\u756a"], ["101130601", "\u5e93\u5c14\u52d2"], ["101130701", "\u963f\u62c9\u5c14"], ["101130801", "\u963f\u514b\u82cf"], ["101130901", "\u5580\u4ec0"], ["101131001", "\u4f0a\u5b81"], ["101131101", "\u5854\u57ce"], ["101131201", "\u54c8\u5bc6"], ["101131301", "\u548c\u7530"], ["101131401", "\u963f\u52d2\u6cf0"], ["101131501", "\u963f\u56fe\u4ec0"], ["101131601", "\u535a\u4e50"]]], [["14", "\u897f\u85cf"], [["101140101", "\u62c9\u8428"], ["101140201", "\u65e5\u5580\u5219"], ["101140301", "\u5c71\u5357"], ["101140401", "\u6797\u829d"], ["101140501", "\u660c\u90fd"], ["101140601", "\u90a3\u66f2"], ["101140701", "\u963f\u91cc"]]], [["15", "\u9752\u6d77"], [["101150101", "\u897f\u5b81"], ["101150201", "\u6d77\u4e1c"], ["101150301", "\u9ec4\u5357"], ["101150401", "\u6d77\u5357"], ["101150501", "\u679c\u6d1b"], ["101150601", "\u7389\u6811"], ["101150701", "\u6d77\u897f"], ["101150801", "\u6d77\u5317"], ["101150901", "\u683c\u5c14\u6728"]]], [["16", "\u7518\u8083"], [["101160101", "\u5170\u5dde"], ["101160201", "\u5b9a\u897f"], ["101160301", "\u5e73\u51c9"], ["101160401", "\u5e86\u9633"], ["101160501", "\u6b66\u5a01"], ["101160601", "\u91d1\u660c"], ["101160701", "\u5f20\u6396"], ["101160801", "\u9152\u6cc9"], ["101160901", "\u5929\u6c34"], ["101161001", "\u6b66\u90fd"], ["101161101", "\u4e34\u590f"], ["101161201", "\u5408\u4f5c"], ["101161301", "\u767d\u94f6"], ["101161401", "\u5609\u5cea\u5173"]]], [["17", "\u5b81\u590f"], [["101170101", "\u94f6\u5ddd"], ["101170201", "\u77f3\u5634\u5c71"], ["101170301", "\u5434\u5fe0"], ["101170401", "\u56fa\u539f"], ["101170501", "\u4e2d\u536b"]]], [["18", "\u6cb3\u5357"], [["101180101", "\u90d1\u5dde"], ["101180201", "\u5b89\u9633"], ["101180301", "\u65b0\u4e61"], ["101180401", "\u8bb8\u660c"], ["101180501", "\u5e73\u9876\u5c71"], ["101180601", "\u4fe1\u9633"], ["101180701", "\u5357\u9633"], ["101180801", "\u5f00\u5c01"], ["101180901", "\u6d1b\u9633"], ["101181001", "\u5546\u4e18"], ["101181101", "\u7126\u4f5c"], ["101181201", "\u9e64\u58c1"], ["101181301", "\u6fee\u9633"], ["101181401", "\u5468\u53e3"], ["101181501", "\u6f2f\u6cb3"], ["101181601", "\u9a7b\u9a6c\u5e97"], ["101181701", "\u4e09\u95e8\u5ce1"], ["101181801", "\u6d4e\u6e90"]]], [["19", "\u6c5f\u82cf"], [["101190101", "\u5357\u4eac"], ["101190201", "\u65e0\u9521"], ["101190301", "\u9547\u6c5f"], ["101190401", "\u82cf\u5dde"], ["101190501", "\u5357\u901a"], ["101190601", "\u626c\u5dde"], ["101190701", "\u76d0\u57ce"], ["101190801", "\u5f90\u5dde"], ["101190901", "\u6dee\u5b89"], ["101191001", "\u8fde\u4e91\u6e2f"], ["101191101", "\u5e38\u5dde"], ["101191201", "\u6cf0\u5dde"], ["101191301", "\u5bbf\u8fc1"]]], [["20", "\u6e56\u5317"], [["101200101", "\u6b66\u6c49"], ["101200201", "\u8944\u9633"], ["101200301", "\u9102\u5dde"], ["101200401", "\u5b5d\u611f"], ["101200501", "\u9ec4\u5188"], ["101200601", "\u9ec4\u77f3"], ["101200701", "\u54b8\u5b81"], ["101200801", "\u8346\u5dde"], ["101200901", "\u5b9c\u660c"], ["101201001", "\u6069\u65bd"], ["101201101", "\u5341\u5830"], ["101201201", "\u795e\u519c\u67b6"], ["101201301", "\u968f\u5dde"], ["101201401", "\u8346\u95e8"], ["101201501", "\u5929\u95e8"], ["101201601", "\u4ed9\u6843"], ["101201701", "\u6f5c\u6c5f"]]], [["21", "\u6d59\u6c5f"], [["101210101", "\u676d\u5dde"], ["101210201", "\u6e56\u5dde"], ["101210301", "\u5609\u5174"], ["101210401", "\u5b81\u6ce2"], ["101210501", "\u7ecd\u5174"], ["101210601", "\u53f0\u5dde"], ["101210701", "\u6e29\u5dde"], ["101210801", "\u4e3d\u6c34"], ["101210901", "\u91d1\u534e"], ["101211001", "\u8862\u5dde"], ["101211101", "\u821f\u5c71"]]], [["22", "\u5b89\u5fbd"], [["101220101", "\u5408\u80a5"], ["101220201", "\u868c\u57e0"], ["101220301", "\u829c\u6e56"], ["101220401", "\u6dee\u5357"], ["101220501", "\u9a6c\u978d\u5c71"], ["101220601", "\u5b89\u5e86"], ["101220701", "\u5bbf\u5dde"], ["101220801", "\u961c\u9633"], ["101220901", "\u4eb3\u5dde"], ["101221001", "\u9ec4\u5c71\u5e02"], ["101221101", "\u6ec1\u5dde"], ["101221201", "\u6dee\u5317"], ["101221301", "\u94dc\u9675"], ["101221401", "\u5ba3\u57ce"], ["101221501", "\u516d\u5b89"], ["101221601", "\u5de2\u6e56"], ["101221701", "\u6c60\u5dde"]]], [["23", "\u798f\u5efa"], [["101230101", "\u798f\u5dde"], ["101230201", "\u53a6\u95e8"], ["101230301", "\u5b81\u5fb7"], ["101230401", "\u8386\u7530"], ["101230501", "\u6cc9\u5dde"], ["101230601", "\u6f33\u5dde"], ["101230701", "\u9f99\u5ca9"], ["101230801", "\u4e09\u660e"], ["101230901", "\u5357\u5e73"]]], [["24", "\u6c5f\u897f"], [["101240101", "\u5357\u660c"], ["101240201", "\u4e5d\u6c5f"], ["101240301", "\u4e0a\u9976"], ["101240401", "\u629a\u5dde"], ["101240501", "\u5b9c\u6625"], ["101240601", "\u5409\u5b89"], ["101240701", "\u8d63\u5dde"], ["101240801", "\u666f\u5fb7\u9547"], ["101240901", "\u840d\u4e61"], ["101241001", "\u65b0\u4f59"], ["101241101", "\u9e70\u6f6d"]]], [["25", "\u6e56\u5357"], [["101250101", "\u957f\u6c99"], ["101250201", "\u6e58\u6f6d"], ["101250301", "\u682a\u6d32"], ["101250401", "\u8861\u9633"], ["101250501", "\u90f4\u5dde"], ["101250601", "\u5e38\u5fb7"], ["101250700", "\u76ca\u9633"], ["101250801", "\u5a04\u5e95"], ["101250901", "\u90b5\u9633"], ["101251001", "\u5cb3\u9633"], ["101251101", "\u5f20\u5bb6\u754c"], ["101251201", "\u6000\u5316"], ["101251401", "\u6c38\u5dde"], ["101251501", "\u5409\u9996"]]], [["26", "\u8d35\u5dde"], [["101260101", "\u8d35\u9633"], ["101260201", "\u9075\u4e49"], ["101260301", "\u5b89\u987a"], ["101260401", "\u90fd\u5300"], ["101260501", "\u51ef\u91cc"], ["101260601", "\u94dc\u4ec1"], ["101260701", "\u6bd5\u8282"], ["101260801", "\u6c34\u57ce"], ["101260901", "\u5174\u4e49"]]], [["27", "\u56db\u5ddd"], [["101270101", "\u6210\u90fd"], ["101270201", "\u6500\u679d\u82b1"], ["101270301", "\u81ea\u8d21"], ["101270401", "\u7ef5\u9633"], ["101270501", "\u5357\u5145"], ["101270601", "\u8fbe\u5dde"], ["101270701", "\u9042\u5b81"], ["101270801", "\u5e7f\u5b89"], ["101270901", "\u5df4\u4e2d"], ["101271001", "\u6cf8\u5dde"], ["101271101", "\u5b9c\u5bbe"], ["101271201", "\u5185\u6c5f"], ["101271301", "\u8d44\u9633"], ["101271401", "\u4e50\u5c71"], ["101271501", "\u7709\u5c71"], ["101271601", "\u51c9\u5c71"], ["101271701", "\u96c5\u5b89"], ["101271801", "\u7518\u5b5c"], ["101271901", "\u963f\u575d"], ["101272001", "\u5fb7\u9633"], ["101272101", "\u5e7f\u5143"]]], [["28", "\u5e7f\u4e1c"], [["101280101", "\u5e7f\u5dde"], ["101280201", "\u97f6\u5173"], ["101280301", "\u60e0\u5dde"], ["101280401", "\u6885\u5dde"], ["101280501", "\u6c55\u5934"], ["101280601", "\u6df1\u5733"], ["101280701", "\u73e0\u6d77"], ["101280800", "\u4f5b\u5c71"], ["101280901", "\u8087\u5e86"], ["101281001", "\u6e5b\u6c5f"], ["101281101", "\u6c5f\u95e8"], ["101281201", "\u6cb3\u6e90"], ["101281301", "\u6e05\u8fdc"], ["101281401", "\u4e91\u6d6e"], ["101281501", "\u6f6e\u5dde"], ["101281601", "\u4e1c\u839e"], ["101281701", "\u4e2d\u5c71"], ["101281801", "\u9633\u6c5f"], ["101281901", "\u63ed\u9633"], ["101282001", "\u8302\u540d"], ["101282101", "\u6c55\u5c3e"]]], [["29", "\u4e91\u5357"], [["101290101", "\u6606\u660e"], ["101290201", "\u5927\u7406"], ["101290301", "\u7ea2\u6cb3"], ["101290401", "\u66f2\u9756"], ["101290501", "\u4fdd\u5c71"], ["101290601", "\u6587\u5c71"], ["101290701", "\u7389\u6eaa"], ["101290801", "\u695a\u96c4"], ["101290901", "\u666e\u6d31"], ["101291001", "\u662d\u901a"], ["101291101", "\u4e34\u6ca7"], ["101291201", "\u6012\u6c5f"], ["101291301", "\u9999\u683c\u91cc\u62c9"], ["101291401", "\u4e3d\u6c5f"], ["101291501", "\u5fb7\u5b8f"], ["101291601", "\u666f\u6d2a"]]], [["30", "\u5e7f\u897f"], [["101300101", "\u5357\u5b81"], ["101300201", "\u5d07\u5de6"], ["101300301", "\u67f3\u5dde"], ["101300401", "\u6765\u5bbe"], ["101300501", "\u6842\u6797"], ["101300601", "\u68a7\u5dde"], ["101300701", "\u8d3a\u5dde"], ["101300801", "\u8d35\u6e2f"], ["101300901", "\u7389\u6797"], ["101301001", "\u767e\u8272"], ["101301101", "\u94a6\u5dde"], ["101301201", "\u6cb3\u6c60"], ["101301301", "\u5317\u6d77"], ["101301401", "\u9632\u57ce\u6e2f"]]], [["31", "\u6d77\u5357"], [["101310101", "\u6d77\u53e3"], ["101310201", "\u4e09\u4e9a"], ["101310202", "\u4e1c\u65b9"], ["101310203", "\u4e34\u9ad8"], ["101310204", "\u6f84\u8fc8"], ["101310205", "\u510b\u5dde"], ["101310206", "\u660c\u6c5f"], ["101310207", "\u767d\u6c99"], ["101310208", "\u743c\u4e2d"], ["101310209", "\u5b9a\u5b89"], ["101310210", "\u5c6f\u660c"], ["101310211", "\u743c\u6d77"], ["101310212", "\u6587\u660c"], ["101310214", "\u4fdd\u4ead"], ["101310215", "\u4e07\u5b81"], ["101310216", "\u9675\u6c34"], ["101310217", "\u897f\u6c99"], ["101310220", "\u5357\u6c99\u5c9b"], ["101310221", "\u4e50\u4e1c"], ["101310222", "\u4e94\u6307\u5c71"]]], [["32", "\u9999\u6e2f"], [["101320101", "\u9999\u6e2f"]]], [["33", "\u6fb3\u95e8"], [["101330101", "\u6fb3\u95e8"]]], [["34", "\u53f0\u6e7e"], [["101340101", "\u53f0\u5317"], ["101340201", "\u9ad8\u96c4"], ["101340401", "\u53f0\u4e2d"]]]];
var provinces = ["北京", "上海", "浙江"];
var citys = [[1, 1000, "beijing", "北京"], [2, 1000, "shanghai", "上海"], [3, 1000, "hangzhou", "杭州"], [3, 1001, "ningbo", "宁波"]];

var CITY_LIST_SELECTOR = "weather_city_list_selector";
var PROVINCE_LIST_SELECTOR = "weather_province_list_selector";
var START_DIV = "weather_start_div";

function initListSelector() {
    pls = goog.dom.getElement(PROVINCE_LIST_SELECTOR);
    cls = goog.dom.getElement(CITY_LIST_SELECTOR);
    goog.array.forEach(provinces, function(province, index, arr) {
        var opt = goog.dom.createDom("option", {"value":index}, province);
        goog.dom.appendChild(pls, opt);
    });

    goog.array.forEach(citys, function(city, index, arr){
        if (city[0] == 1) {
            var opt = goog.dom.createDom("option", {"value":city[1]}, city[3]);
            goog.dom.appendChild(cls, opt);
        }
    });
}

function listenListSelectorEvent(province_index) {
    cls = goog.dom.getElement(CITY_LIST_SELECTOR);
    while ( cls.firstChild ) cls.removeChild( cls.firstChild );
    goog.array.forEach(citys, function(city, index, arr) {
        console.log(province_index+1);
        console.log("====" + city[0]);
        if (city[0] == province_index+1) {
            var opt = goog.dom.createDom("option", {"value":city[1]}, city[3]);
            goog.dom.appendChild(cls, opt);
        }
    });
    goog.events.listen(goog.dom.getElement(CITY_LIST_SELECTOR), goog.events.EventType.CHANGE,
                        function(e) { 
                            // console.log(e.target.value);
                            city_code = e.target.value
                            // requestWeatherInfo(city_code);
                        });
}

function requestWeatherInfo(city_code) {
    url = "http://m.weather.com.cn/data/" + city_code + ".html";
    goog.net.XhrIo.send(url, function(e) { // e.type will be goog.net.EventType.COMPLETE
        var xhr = /** @type {goog.net.XhrIo} */ (e.target);
        if (xhr.getStatus() == 201) {
            alert('The new user was created!'); 
        } else {
            alert('Oh no, there was a problem!'); 
        }
        console.log(xhr.getResponseText());
    });
}

function onload(){
    obtainProvienceAndCity(1);
    initListSelector();
    initPinyinSelector();
    goog.events.listen(goog.dom.getElement(PROVINCE_LIST_SELECTOR), goog.events.EventType.CHANGE,
                        function(e) {
                            listenListSelectorEvent(parseInt(e.target.value));
                        });
    goog.events.listen(goog.dom.getElement("weather_city_choose"), goog.events.EventType.CLICK,
                        function(e) {
                            city_div = goog.dom.getElement(START_DIV);
                            if (city_div.style.display) {
                                city_div.style.display = "";
                            } else {
                                city_div.style.display = "None";
                            }
                            
                        });
}

var selector_tab = ["hot", "abcde", "fghij", "klmno", "pqrst", "uvwxyz"];
var tab_name_prefix = "piyin_selector_";

function indexPinyin(pinyin, index) {
    var firstChar = pinyin.charAt(0);
    if (index.indexOf(firstChar) > 0) {
        return true;
    } else {
        return false;
    }
}

function initPinyinSelector() {
    // init selector tab
    goog.array.forEach(selector_tab, function(tab, index, arr){
        var tab_div = goog.dom.createDom("div", {"id" : tab_name_prefix + tab}, tab);
        goog.dom.appendChild(goog.dom.getElement(START_DIV), tab_div);
        listenPinyinSelectorEvent(tab_div);
    });

    // init selector content
    goog.array.forEach(selector_tab, function(tab, index, arr){
        var tab_div = goog.dom.createDom("div", {"id" : tab_name_prefix + "content_" + tab});
        goog.dom.appendChild(goog.dom.getElement(START_DIV), tab_div)
    });
    goog.array.forEach(citys, function(city, index, arr){
        var item_name = tab_name_prefix + "content_hot";
        var city_pinyin = city[2];
        goog.array.forEach(selector_tab, function(selector, index, arr){
            if (indexPinyin(city_pinyin, selector)){
                item_name = tab_name_prefix + "content_" + selector;
            }
        });
        var selector_content = goog.dom.getElement(item_name);
        var city_div = goog.dom.createDom("div", {"id":city[2]}, city[3]);
        goog.dom.appendChild(selector_content, city_div);
        listenPinyinSelectorContentEvent(city_div);
    });
}

function obtainPinyinSelectorContent(tab_div) {
    var tab_content = tab_div.id.replace(tab_name_prefix, tab_name_prefix + "content_");
    return goog.dom.getElement(tab_content);
}


function listenPinyinSelectorEvent(selector_div) {
    goog.events.listen(selector_div, goog.events.EventType.CLICK,
        function(e) {
            goog.array.forEach(selector_tab, function(tab, index, arr){
                var tab_name = tab_name_prefix + "content_" + tab;
                var tab_div = goog.dom.getElement(tab_name);
                tab_div.style.display = "none";
            });
            obtainPinyinSelectorContent(e.target).style.display = "";
        });
}

function listenPinyinSelectorContentEvent(city_div) {
    goog.events.listen(city_div, goog.events.EventType.CLICK, 
        function(e){
            console.log(e.target.id);
            //obtainProvienceAndCity(e.target.id);
        });
}

goog.require("goog.ui.Select");
goog.require("goog.ui.Option");

function obtainProvienceAndCity(city_code){
    choose_city = "";
    goog.array.forEach(citys, function(city, index, arr) {
        if (city[2] == city_code) {
            choose_city = city;
        }
    });

    choose_province = provinces[choose_city[0]];
    var pls = goog.dom.getElement(PROVINCE_LIST_SELECTOR);

    var city_selector = new goog.ui.Select();
    goog.array.forEach(citys, function(city, index, arr){
        city_selector.addItem(new goog.ui.Option(city[3]));
    });
    city_selector.render(goog.dom.getElement(START_DIV));
}
