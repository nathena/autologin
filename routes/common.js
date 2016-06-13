/**
 * Created by nathena on 16/6/13.
 */
var uuid = require("../lib/UUID");
var db = require("../lib/Mysqlc").createDb(Config.db_mysqlConfig);

exports.storeCookie = function(uid,site,set_cookies,callback){
    //后台自动
    var cookie = null;
    var cookies = [];
    Object.keys(set_cookies).forEach(function(key){
        set_cookies[key].forEach(function(_cookie){
            cookie = {}
            cookie["id"] = uuid.uuid();
            cookie["site"] = site;
            cookie["state"] = 1;
            cookie["host"] = key;
            cookie["uid"] = uid;
            cookie["cookie"] = _cookie;

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