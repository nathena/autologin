/**
 * Created by nathena on 16/6/13.
 */

var querystring = require("querystring");

var data = {};
data["txtUserName"] = "1111";
data["txtPassword"] = "2222";
data["txtAuthCode"] = "33333";
data["act"] = "webLogin";

console.log(querystring.stringify(data));
