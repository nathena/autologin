/**
 * Created by nathena on 16/6/12.
 */
var request = require("request");
var needle = require("needle");
var base = require("./base");
var http = require('http');

var url = "http://www.917.com/login.html";
var cap = "http://www.917.com/api/authCode.html?key=loginAuthCode";
var loginApi = "http://www.917.com/api/user.html";

module.exports = function(router){

    router.get("/s917/cap",function(req,res){
        var reqheaders = req.session["reqheaders"] || base.getReqHeaders();
        request.get({url:cap+"&t="+new Date().getTime(),headers:reqheaders}).on('response', function(response) {
            logger.debug(response.headers['set-cookie']);
        }).pipe(res);
    })

    router.get("/s917/:uid",function(req,res){
        var reqheaders = base.getReqHeaders();
        req.session["_uid"] = req.params["uid"];

        request.get({url:url,headers:reqheaders},function(err,response,body){

            var set_cookies = {};
            set_cookies = base.addCookies(set_cookies,url,base.parserCookiejar(reqheaders,response.headers["set-cookie"]));

            req.session["set_cookies"] = set_cookies;
            req.session["reqheaders"] = reqheaders;

            res.render("s917.html",{baseurl:req["_baseurl"],_csrf:req.csrfToken()});
        })
    })

    //http://www.917.com/api/user.html
    router.post("/s917/:uid",function(req,res,next){
        //act=webLogin&txtUserName=1111&txtPassword=111&txtAuthCode=111
        var txtUserName = req.body.username;
        var txtPassword = req.body.password;
        var txtAuthCode = req.body.txtAuthCode;

        var reqheaders = req.session["reqheaders"] || base.getReqHeaders();

        var uid = req.session["_uid"];
        var data = {};
        data["txtUserName"] = txtUserName.trim();;
        data["txtPassword"] = txtPassword.trim();;
        data["txtAuthCode"] = txtAuthCode.trim();;
        data["act"] = "webLogin";

        request.post({url:loginApi,form:data,headers:reqheaders},function(err,response,body){
            if(err){
                return next(err);
            }

            var set_cookies = req.session["set_cookies"] || {};
            set_cookies = base.addCookies(set_cookies,loginApi,base.parserCookiejar(reqheaders,response.headers["set-cookie"]));
            return base.storeCookie(uid,"s917",set_cookies,function(){
                res.send(body);
            });
        })
    })
}