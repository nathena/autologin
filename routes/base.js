/**
 * Created by nathena on 16/6/13.
 */
var uuid = require("../lib/UUID");
var cookiejar = require("cookiejar");
var parserUrl = require("url");
var db = require("../lib/Mysqlc").createDb(Config.db_mysqlConfig);

exports.addCookies = function(cookies,key,cookiejars){
    var cookie = cookies[key] || {};
    Object.keys(cookiejars).forEach(function(_cookiestr){
        cookie[_cookiestr] = cookiejars[_cookiestr];
    })

    cookies[key] = cookie;

    return cookies;
}

exports.parserCookiejar = function(reqheader,set_cookie){
    var cookies = [],cookiejars = {};
    if( reqheader["Cookie"] ){
        cookies.push(reqheader["Cookie"]);
    }
    if( Array.isArray(set_cookie)){
        var cookie = null;
        set_cookie.forEach(function(_cookiestr){
            cookie = cookiejar.Cookie(_cookiestr);
            cookies.push(cookie.toValueString());

            cookiejars[_cookiestr] = cookie.toValueString();
        })
    }else{
        cookie = cookiejar.Cookie(set_cookie);
        cookies.push(cookie.toValueString());

        cookiejars[set_cookie] = cookie.toValueString();
    }
    reqheader["Cookie"] = cookies.join("; ");

    return cookiejars;
}

exports.getReqHeaders = function(){
    var reqheaders = {}
    reqheaders["User-Agent"] = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:46.0) Gecko/20100101 Firefox/46.0";
    reqheaders["Accept"] = "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8";
    reqheaders["Accept-Language"] = "zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3";
    //options["Accept-Encoding"] = "gzip, deflate";
    reqheaders["Connection"] = "keep-alive";
    reqheaders["Cache-Control"] = "max-age=0";
    return reqheaders;
}

exports.storeCookie = function(uid,site,set_cookies,callback){
    //后台自动
    var cookie = null,cookiejar=null;
    var cookies = [];
    var uri = "";
    Object.keys(set_cookies).forEach(function(url){

        uri = parserUrl.parse(url);
        cookiejar = set_cookies[url];

        Object.keys(cookiejar).forEach(function(_cookiejar){
            cookie = {}
            cookie["id"] = uuid.uuid();
            cookie["site"] = site;
            cookie["state"] = 1;
            cookie["host"] = uri["host"];
            cookie["uid"] = uid;
            cookie["cookie"] = cookiejar[_cookiejar];
            cookie["cookiejar"] = _cookiejar;
            cookie["host_full"] = uri["protocol"]+"//"+uri["host"];

            cookies.push(cookie);
        })
    })

    var _dbStatement = null;
    db.del("t_proxy_cookie",{"site":site}).then(function(dbStatement){
        _dbStatement = dbStatement;
        dbStatement.inserts("t_proxy_cookie",cookies).then(function(dbStatement){
            _dbStatement = dbStatement;
            return dbStatement.dbConnection.release();
        });
    }).catch(function(ex){
        if(_dbStatement){
            return _dbStatement.dbConnection.release();
        }
    })

    return callback && callback();
}