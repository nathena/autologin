/**
 * Created by nathena on 16/6/12.
 */

var uri = require("url");
var request = require("request");
var base = require("./base");

var url = "http://www.xiaoyu.com/login";

module.exports = function(router){

    router.get("/xmfish/:uid",function(req,res){
        req.session["_uid"] = req.params["uid"];
        res.render("xmfish.html",{baseurl:req["_baseurl"],_csrf:req.csrfToken()})
    })

    router.post("/xmfish/:uid",function(req,res,next){

        var reqheaders = base.getReqHeaders();

        var uid = req.session["_uid"];
        var data = {};
        data["username"] = req.body["username"];
        data["password"] = req.body["password"];

        var set_cookies = {};
        var sso = [];
        var sso_index = 0;

        request.post({url:url,form:data,headers:reqheaders,followAllRedirects:true},function(err,response,body){
            if( err ){
                return next(err);
            }
            var re = /url:'(\S+)'/img;
            var r = "";
            while(r = re.exec(body)){
                sso.push(r[1]);
            }
            if( sso.length == 0 ){
                return res.send("登录失败")
            }

            set_cookies = base.addCookies(set_cookies,url,base.parserCookiejar(reqheaders,response.headers["set-cookie"]));
            sso_request(sso[sso_index]);
        })

        function sso_request(url){
            request.get({url:url,headers:reqheaders},function(err,response){
                if( err ){
                    return next(err);
                }
                set_cookies = base.addCookies(set_cookies,url,base.parserCookiejar(reqheaders,response.headers["set-cookie"]));
                sso_index++;
                if( sso.length == sso_index){
                    return base.storeCookie(uid,"xmfish",set_cookies,function(){
                        res.send("登录成功");
                    });
                }else{
                    sso_request(sso[sso_index]);
                }
            })
        }
    })

    return router;
};