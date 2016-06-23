/**
 * Created by nathena on 16/6/12.
 */

var uri = require("url");
var util = require("util");
var querystring = require("querystring")
var request = require("request");
var base = require("./base");
var cheerio = require("cheerio");

var url = "https://passport.ganji.com/login.php";
var loginApi = "https://passport.ganji.com/login.php?callback=jQuery1820794474356953011_1465900211457&%s&second=&parentfunc=&redirect_in_iframe=&next=http%3A%2F%2Fwww.ganji.com%2F";
var vcodeApi = "https://passport.ganji.com/ajax.php?dir=captcha&module=login_captcha&nocache="

module.exports = function(router){

    router.get("/ganji/cap",function(req,res){
        var reqheaders = base.getReqHeaders();
        reqheaders["Referer"]="https://passport.ganji.com/login.php";
        request.get({url:vcodeApi+new Date().getTime(),headers:reqheaders}).on('response', function(response) {
            var set_cookies = base.addCookies({},url,base.parserCookiejar(reqheaders,response.headers["set-cookie"]));;
            req.session["set_cookies"] = set_cookies;
            req.session["reqheaders"] = reqheaders;
        }).pipe(res);
    })

    router.get("/ganji/:uid",function(req,res){
        req.session["_uid"] = req.params["uid"];
        res.render("ganji.html",{baseurl:req["_baseurl"],_csrf:req.csrfToken()})
    })

    router.post("/ganji/:uid",function(req,res,next){
        var reqheaders = req.session["reqheaders"] || base.getReqHeaders();
        var uid = req.session["_uid"];
        var data = {};
        data["username"] = req.body["username"];
        data["password"] = req.body["password"];
        data["checkCode"] =req.body["txtAuthCode"];
        data["setcookie"] = "14";

        var _loginApi = util.format(loginApi,querystring.stringify(data));
        var set_cookies = req.session["set_cookies"] || {};
        request.get({url:_loginApi,headers:reqheaders},function(err,response,body){
            if( err ){
                return next(err);
            }
            set_cookies = base.addCookies(set_cookies,url,base.parserCookiejar(reqheaders,response.headers["set-cookie"]));
            return base.storeCookie(uid,"ganji",set_cookies,function(){
                console.log(body);
                res.send(body);
            });
        })
    })

    return router;
};