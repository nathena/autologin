/**
 * Created by nathena on 16/6/12.
 */

var uri = require("url");
var request = require("request");
var cheerio = require("cheerio");
var uuid = require("../lib/UUID");
var db = require("../lib/Mysqlc").createDb(Config.db_mysqlConfig);

var reqheaders = {}
reqheaders["User-Agent"] = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:46.0) Gecko/20100101 Firefox/46.0";
reqheaders["Accept"] = "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8";
reqheaders["Accept-Language"] = "zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3";
//options["Accept-Encoding"] = "gzip, deflate";
reqheaders["Connection"] = "keep-alive";
reqheaders["Cache-Control"] = "max-age=0";
reqheaders["Referer"] = "http://bbs.xmfish.com/login.php";

var url = "http://www.xiaoyu.com/login";

module.exports = function(router){

    router.get("/xmfish",function(req,res){
        res.render("xmfish.html",{baseurl:"/test",uid:req.query["uid"]})
    })

    router.post("/xmfish",function(req,res){

        /**
         * jumpurl	http://www.xmfish.com/
         loginurl	http://bbs.xmfish.com/login.php
         action	bbs
         bbs_id	63
         username	1111
         password	1111
         */

        var uid = req.body["uid"]

        var data = {};
        data["username"] = req.body["username"];
        data["password"] = req.body["password"];

        var set_cookies = {};
        var sso = [];
        var sso_index = 0;

        request.post({url:url,form:data,headers:reqheaders,followAllRedirects:true},function(err,response,body){
            if( err ){
                return res.send(err);
            }

            var re = /url:'(\S+)'/img;
            var r = "";
            while(r = re.exec(body)){
                sso.push(r[1]);
            }

            if( sso.length == 0 ){
                return res.send("登录失败")
            }

            set_cookies[uri.parse(url)["host"]] = response.headers["set-cookie"];
            sso_request(sso[sso_index]);
        })

        function sso_request(url){
            request.get({url:url,headers:reqheaders},function(err,response){
                set_cookies[uri.parse(url)["host"]] = response.headers["set-cookie"];
                sso_index++;
                if( sso.length == sso_index){
                    store_cookies();
                }else{
                    console.log(" sso_index => ",sso_index);
                    sso_request(sso[sso_index]);
                }
            })
        }

        function store_cookies(){
            //后台自动
            var cookie = null;
            Object.keys(set_cookies).forEach(function(key){
                set_cookies[key].forEach(function(_cookie){
                    cookie = {}
                    cookie["id"] = uuid.uuid();
                    cookie["site"] = "xmfish";
                    cookie["state"] = 1;
                    cookie["host"] = key;
                    cookie["cookie"] = _cookie;

                    db.insert("t_proxy_cookie",cookie).then(function(dbStatement){
                        dbStatement.dbConnection.release();
                    });
                })
            })
            res.send("登录成功");
        }
    })

    return router;
};