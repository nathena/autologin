/**
 * Created by nathena on 16/6/14.
 */
var request = require("request");
var rsa = require("../lib/RSA.min");

var base = require("./base");

var url = "https://passport.fang.com/login.api";

module.exports = function(router){

    router.get("/fang/:uid",function(req,res){

        req.session["_uid"] = req.params["uid"];
        res.render("fang.html",{baseurl:req["_baseurl"],_csrf:req.csrfToken()})
    })


    router.post("/fang/:uid",function(req,res){

        req.session["_uid"] = req.params["uid"];

        var reqheaders = req.session["reqheaders"] || base.getReqHeaders();
        reqheaders["Referer"] = "https://passport.fang.com";

        var key_to_encode = new rsa.RSAKeyPair("010001", "", "978C0A92D2173439707498F0944AA476B1B62595877DD6FA87F6E2AC6DCB3D0BF0B82857439C99B5091192BC134889DFF60C562EC54EFBA4FF2F9D55ADBCCEA4A2FBA80CB398ED501280A007C83AF30C3D1A142D6133C63012B90AB26AC60C898FB66EDC3192C3EC4FF66925A64003B72496099F4F09A9FB72A2CF9E4D770C41");
        var pwd = rsa.encryptedString(key_to_encode,req.body["password"]);

        var uid = req.session["_uid"];
        var data = {}
        data["Uid"] = escape(req.body["username"]);
        data["Pwd"] = escape(pwd);
        data["Service"] = escape("soufun-passport-web");
        data["AutoLogin"] = escape("1");
        data["IP"] = escape("");
        data["VCode"] = escape("");

        var set_cookies = req.session["set_cookies"] || {};
        request.post({url:url,form:data,headers:reqheaders},function(err,response,body){
            set_cookies = base.addCookies(set_cookies,url,base.parserCookiejar(reqheaders,response.headers["set-cookie"]));
            console.log(response.headers)
            return base.storeCookie(uid,"fang",set_cookies,function(){
                console.log(body);
                res.send(body);
            });
        })
    })
}