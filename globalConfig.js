/**
 * 项目配置文件
 */
var path = require("path");
var log4js = require("log4js");

var Config = {
    debug: true,
    name: "自动登录",
    description: "爬虫登录",
    version: "0.1.0",
    cookie_prefix:"_fmm_autologin",
    redis :{
        host: "127.0.0.1",
        port: 6379,
        db: 1 //Database index to use
    },
    session: {
        secret: 'shadower',
        resave:true,
        saveUninitialized:true,
        cookie:{secure: true,maxAge:60*60*24*1000,"httpOnly":true,"path":"/"}
    },
    log4js: {
        "category": "console",
        //"category": "logInfo",
        "appenders": [
            // 下面一行应该是用于跟express配合输出web请求url日志的
            {"type": "console", "category": "console"},
            // 定义一个日志记录器
            {
                "type": "dateFile",                // 日志文件类型，可以使用日期作为文件名的占位符
                "filename": path.join(__dirname,'logs',"/"),    // 日志文件名，可以设置相对路径或绝对路径
                "maxLogSize": 1024,
                "pattern": "info-yyyyMMdd.txt",    // 占位符，紧跟在filename后面
                "absolute": true,                  // filename是否绝对路径
                "alwaysIncludePattern": true,      // 文件名是否始终包含占位符
                "category": "logInfo"              // 记录器名
            }],
        "levels": {"logInfo": "DEBUG"}        // 设置记录器的默认显示级别，低于这个级别的日志，不会输出
    },

    db_mysqlConfig: {
        "host": "127.0.0.1",
        "user": "root",
        "password": "",
        "database": "crawler",
        "dateStrings":true,
        debug:false
    },

    //mongoClient : "mongodb://127.0.0.1:27017/crawlers"
};


//String.format
if( !String.prototype.format ){

    String.prototype.format = function() {
        var s = this;
        for (var i = 0; i < arguments.length; i++) {
            var reg = new RegExp("\\{" + i + "\\}", "gm");
            s = s.replace(reg, arguments[i]);
        }
        return s;
    };
}

if (!String.prototype.repeat) {
    String.prototype.repeat = function(count) {
        'use strict';
        if (this == null) {
            throw new TypeError('can\'t convert ' + this + ' to object');
        }
        var str = '' + this;
        count = +count;
        if (count != count) {
            count = 0;
        }
        if (count < 0) {
            throw new RangeError('repeat count must be non-negative');
        }
        if (count == Infinity) {
            throw new RangeError('repeat count must be less than infinity');
        }
        count = Math.floor(count);
        if (str.length == 0 || count == 0) {
            return '';
        }
        // Ensuring count is a 31-bit integer allows us to heavily optimize the
        // main part. But anyway, most current (August 2014) browsers can't handle
        // strings 1 << 28 chars or longer, so:
        if (str.length * count >= 1 << 28) {
            throw new RangeError('repeat count must not overflow maximum string size');
        }
        var rpt = '';
        for (;;) {
            if ((count & 1) == 1) {
                rpt += str;
            }
            count >>>= 1;
            if (count == 0) {
                break;
            }
            str += str;
        }
        return rpt;
    }
}

//全局logger
log4js.configure(Config.log4js);

global.logger = exports.logger = log4js.getLogger(Config.log4js.category);
global.Config = exports.Config = Config;