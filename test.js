/**
 * Created by nathena on 16/6/12.
 */
var request = require("request");
var rsa = require("./lib/RSA.min")
//rsa.setMaxDigits(129)
var key_to_encode = new rsa.RSAKeyPair("010001", "", "978C0A92D2173439707498F0944AA476B1B62595877DD6FA87F6E2AC6DCB3D0BF0B82857439C99B5091192BC134889DFF60C562EC54EFBA4FF2F9D55ADBCCEA4A2FBA80CB398ED501280A007C83AF30C3D1A142D6133C63012B90AB26AC60C898FB66EDC3192C3EC4FF66925A64003B72496099F4F09A9FB72A2CF9E4D770C41");
var pwd = rsa.encryptedString(key_to_encode,"fangmm321");

//33f7aa13e7f09e2dc15af0f97e015872f579f7ccd5701636cb6e6b2e5b71b428fec34a5b8340dfe14f025a2056c3db36c9a41c162db69c87518dd237dea85ca48fac734edbf440a4bd351e1012310633d039414c13ac2fb84de8fbf6300609f7c6844c9836213c8842dddb63af25d27f509f34e1f4055be0794b8dfa5635f106

var reqheaders = {}
reqheaders["User-Agent"] = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:46.0) Gecko/20100101 Firefox/46.0";
reqheaders["Accept"] = "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8";
reqheaders["Accept-Language"] = "zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3";
//options["Accept-Encoding"] = "gzip, deflate";
reqheaders["Connection"] = "keep-alive";
reqheaders["Cache-Control"] = "max-age=0";
reqheaders["Referer"] = "https://passport.fang.com";
//reqheaders["Cookie"] = "global_cookie=7f67e48c-1464758459962-0bcd6109; global_wapandm_cookie=icfoix3688zc1xu9jupewhbo1cyiowfd82e; __jsluid=5760415ce367cf63d02473666d32553f; sf_source=; s=; showAdxm=1; city=xm; unique_cookie=U_82d54af7-1465895868478-6d7eea6c*1; __utmmobile=0x56204f8d2596b8c1; JSESSIONID=aaao-uizvtKdGglkosovv; firstlocation=1; zhcity=%u53A6%u95E8; encity=xm; addr=%u798F%u5EFA%u7701%u53A6%u95E8%u5E02; __utmt_t0=1; __utmt_t1=1; __utma=147393320.491582955.1464758459.1465291181.1465897232.5; __utmb=147393320.11.10.1465897232; __utmc=147393320; __utmz=147393320.1464758459.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); mencity=bj; Captcha=52676B6D57343835646172703176746575305575394E7831716B754C53386339462F3841584D6759467059343470793743695A56376D51366466637A53376C597338695334427A476549773D; unique_wapandm_cookie=U_exlygyjpl37iycnburtcjhnl234ipf8jtns*10"

var data = {}
data["Uid"] = escape("18150098259");
data["Pwd"] = escape(pwd);
data["Service"] = escape("soufun-passport-web");
data["AutoLogin"] = escape("1");
data["IP"] = escape("");
data["VCode"] = escape("");


request.post({url:"https://passport.fang.com/login.api",form:data,headers:reqheaders},function(err,resp,body){
    console.log(resp.headers)
    console.log(body);
})