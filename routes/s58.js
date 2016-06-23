/**
 * Created by nathena on 16/6/14.
 */
var request = require("request");
var base = require("./base");

var url = "http://m.m.58.com/login?path=http://my.58.com/";
var passport_url1 = "http://passport.58.com/m/ui?source=m-my&successFunction=pwdLogin&risktype=2";
var passport_url2 = "http://passport.58.com/feature/ui?source=m-my&successFunction=pwdLogin";
var passport_url3 = "http://passport.58.com/mobileauthcodelogin/ui?source=m-my&successFunction=phoneLogin&win=m&risktype=3";
var passport_submit = "https://passport.58.com/submit";

var loginApi = "https://passport.58.com/m/uilogin";

module.exports = function(router){

    router.get("/s58/:uid",function(req,res){

        req.session["_uid"] = req.params["uid"];

        var reqheaders = base.getReqHeaders();
        reqheaders["User-Agent"] = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.87 Safari/537.36";
        reqheaders["Referer"] = url;

        var set_cookies = {};

        request({url:url,headers:reqheaders},function(err,response,body){
            console.log(response.headers);
            set_cookies = base.addCookies(set_cookies,"http://m.58.com",base.parserCookiejar(reqheaders,response.headers["set-cookie"]));

            req.session["set_cookies"] = set_cookies;
            req.session["reqheaders"] = reqheaders;

            res.render("s58.html",{baseurl:req["_baseurl"],_csrf:req.csrfToken()})

            req_passport_url1();
        })

        function req_passport_url1(){

            var reqheaders = req.session["reqheaders"] || base.getReqHeaders();
            request({url:passport_url1,headers:reqheaders},function(err,response,body){
                console.log(response.headers);
                set_cookies = base.addCookies(set_cookies,"http://m.58.com",base.parserCookiejar(reqheaders,response.headers["set-cookie"]));

                req.session["set_cookies"] = set_cookies;
                req.session["reqheaders"] = reqheaders;

                req_passport_url2();
            })
        }

        function req_passport_url2(){
            var reqheaders = req.session["reqheaders"] || base.getReqHeaders();
            request({url:passport_url2,headers:reqheaders},function(err,response,body){
                console.log(response.headers);
                set_cookies = base.addCookies(set_cookies,"http://m.58.com",base.parserCookiejar(reqheaders,response.headers["set-cookie"]));

                req.session["set_cookies"] = set_cookies;
                req.session["reqheaders"] = reqheaders;

                req_passport_url3();
            })
        }

        function req_passport_url3(){
            var reqheaders = req.session["reqheaders"] || base.getReqHeaders();
            request({url:passport_url3,headers:reqheaders},function(err,response,body){
                console.log(response.headers);
                set_cookies = base.addCookies(set_cookies,"http://m.58.com",base.parserCookiejar(reqheaders,response.headers["set-cookie"]));

                req.session["set_cookies"] = set_cookies;
                req.session["reqheaders"] = reqheaders;

                passport_submit();
            })
        }

        function passport_submit(){
            var reqheaders = req.session["reqheaders"] || base.getReqHeaders();
            request({url:passport_url3,headers:reqheaders},function(err,response,body){
                console.log(response.headers);
                set_cookies = base.addCookies(set_cookies,"http://m.58.com",base.parserCookiejar(reqheaders,response.headers["set-cookie"]));

                req.session["set_cookies"] = set_cookies;
                req.session["reqheaders"] = reqheaders;

                console.log(set_cookies);
            })
        }

    })


    router.post("/s58/:uid",function(req,res){

        var reqheaders = req.session["reqheaders"] || base.getReqHeaders();

        var uid = req.session["_uid"];
        var data = {}
        data["pptmobile"] = req.body["username"];
        data["pptmobilepassword"] = req.body["password"];
        data["source"] = "m-my";
        data["callback"] = "handleMLoginResult";
        data["risktype"] = "2";

        var set_cookies = req.session["set_cookies"] || {};
        request.post({url:loginApi,form:data,headers:reqheaders},function(err,response,body){
            set_cookies = base.addCookies(set_cookies,"http://m.58.com",base.parserCookiejar(reqheaders,response.headers["set-cookie"]));
            console.log(response.headers)
            var location = response.headers["location"];
            return base.storeCookie(uid,"fang",set_cookies,function(){
                console.log(body);
                res.send("123213");
            });

            if( location ){
                request({url:location,headers:reqheaders},function(err,response,body){
                    console.log(response.headers)
                })
            }
        })
    })
}