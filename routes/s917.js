/**
 * Created by nathena on 16/6/12.
 */
var uri = require("url");
var request = require("request");
var cheerio = require("cheerio");
var uuid = require("../lib/UUID");
var db = require("../lib/Mysqlc").createDb(Config.db_mysqlConfig);

function getReqHeaders(){
    var reqheaders = {}
    reqheaders["User-Agent"] = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:46.0) Gecko/20100101 Firefox/46.0";
    reqheaders["Accept"] = "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8";
    reqheaders["Accept-Language"] = "zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3";
    //options["Accept-Encoding"] = "gzip, deflate";
    reqheaders["Connection"] = "keep-alive";
    reqheaders["Cache-Control"] = "max-age=0";
    reqheaders["Referer"] = "http://www.917.com/login.html";

    return reqheaders;
}

var url = "http://www.917.com/login.html";
var cap = "http://www.917.com/api/authCode.html?key=loginAuth";

module.exports = function(router){
    router.get("/s917/:uid",function(req,res){
        request.get({url:url,headers:reqheaders},function(err,response,body){
            var cookies = [];
            cookies = cookies.concat(response.headers["set-cookie"]);

            var reqheaders = getReqHeaders();
            reqheaders["Cookie"] = cookies.join("; ");

            req.session["_autoload_uid_"] = req.params["uid"];
            req.session["reqheaders"] = reqheaders;
            req.session["_csrf"] = req.csrfToken();

            res.render("s917.html",{baseurl:req["_baseurl"],_csrf:req.csrfToken()});
        })
    })

    router.get("/s917/cap",function(req,res){
        var reqheaders = req.session["reqheaders"];
        if( !reqheaders ){
            reqheaders = getReqHeaders();
        }
        request.get({url:cap,headers:reqheaders}).on('response', function(response) {
            logger.debug(response.statusCode) // 200
            logger.debug(response.headers['content-type']) // 'image/png'
            logger.debug(response.headers['set-cookie'])
        }).pipe(res);
    })

    router.post("/s917/:uid",function(req,res){

    })

}