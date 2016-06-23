/**
 * Created by nathena on 16/6/12.
 */

var uri = require("url");
var util = require("util");
var querystring = require("querystring")
var request = require("request");
var base = require("./base");

var url = "http://user.anjuke.com/my/login";
var loginApi = "http://member.anjuke.com/api/login/submit?%s&callback=window.user.callbackDetail";
//username=3079340668%40qq.com&password=fangmm321&remember=true&captcha=

module.exports = function(router){

    router.get("/anjuke/:uid",function(req,res){
        req.session["_uid"] = req.params["uid"];
        res.render("anjuke.html",{baseurl:req["_baseurl"],_csrf:req.csrfToken()})
    })

    router.post("/anjuke/:uid",function(req,res,next){

        var reqheaders = base.getReqHeaders();

        var uid = req.session["_uid"];
        var data = {};
        data["username"] = req.body["username"];
        data["password"] = req.body["password"];
        data["remember"] = "true";
        data["captcha"] = "";

        var _loginApi = util.format(loginApi,querystring.stringify(data));
        var set_cookies = {};
        request.get({url:_loginApi,headers:reqheaders},function(err,response,body){
            if( err ){
                return next(err);
            }

            set_cookies = base.addCookies(set_cookies,url,base.parserCookiejar(reqheaders,response.headers["set-cookie"]));
            return base.storeCookie(uid,"anjuke",set_cookies,function(){
                res.send(body);
            });
        })
    })

    return router;
};