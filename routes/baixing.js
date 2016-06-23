/**
 * Created by nathena on 16/6/12.
 */

var uri = require("url");
var querystring = require("querystring")
var request = require("request");
var base = require("./base");
var cheerio = require("cheerio");

var url = "http://www.baixing.com/oz/login";
var loginApi = "http://www.baixing.com/oz/login";

module.exports = function(router){

    router.get("/baixing/:uid",function(req,res){

        var reqheaders = base.getReqHeaders();
        var data = {};

        req.session["_uid"] = req.params["uid"];

        request.get({url:url,headers:reqheaders},function(err,response,body){

            var set_cookies = base.addCookies({},url,base.parserCookiejar(reqheaders,response.headers["set-cookie"]));

            req.session["set_cookies"] = set_cookies;
            req.session["reqheaders"] = reqheaders;

            var $ = cheerio.load(body,{decodeEntities: false});
            //var token = $("input[name='token']").val();

            data[$("#authform").find("input[type='hidden']").eq(0).attr("name")] = $("#authform").find("input[type='hidden']").eq(0).val();
            data[$("#authform").find("input[type='hidden']").eq(1).attr("name")] = $("#authform").find("input[type='hidden']").eq(1).val();

            req.session["data"] = data;
            //var
            res.render("baixing.html",{baseurl:req["_baseurl"],_csrf:req.csrfToken()})
        })
    })

    router.post("/baixing/:uid",function(req,res,next){

        var reqheaders = req.session["reqheaders"] || base.getReqHeaders();

        var uid = req.session["_uid"];
        var data = req.session["data"] || {};
        data["identity"] = req.body["username"];
        data["password"] = req.body["password"];

        var set_cookies = req.session["set_cookies"] || {};
        request.post({url:loginApi,form:data,headers:reqheaders},function(err,response,body){
            if( err ){
                return next(err);
            }
            set_cookies = base.addCookies(set_cookies,url,base.parserCookiejar(reqheaders,response.headers["set-cookie"]));
            return base.storeCookie(uid,"baixing",set_cookies,function(){
                console.log(body);
                res.send("登录成功");
            });
        })
    })

    return router;
};