require("./globalConfig");
var express = require('express');
var csrf = require('csurf')
var session = require('express-session');
//var RedisStore = require('connect-redis')(session);
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();
//var router = express.Router();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('.html', require('ejs').renderFile);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan('dev'));
//x-powered-by
app.disable("x-powered-by");
//cookie & session
app.use(cookieParser(Config.cookie_prefix));
//正式环境改为redis
//app.use(session({
//    store: new RedisStore({
//        host: Config.redis.host,
//        port: Config.redis.port,
//        db: Config.redis.db
//    }),
//    resave:Config.session.resave,
//    saveUninitialized:Config.session.saveUninitialized,
//    secret: Config.session.secret,
//    cookie:Config.session.cookie,
//    name:Config.cookie_prefix
//}));
app.use(session({
  name:Config.cookie_prefix,
  resave:Config.session.resave,
  saveUninitialized:Config.session.saveUninitialized,
  secret: Config.session.secret
}));
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(csrf({cookie:true,sessionKey:"_csrf" }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req,res,next){
  req["_baseurl"] = "/test";
  next();
})

var domain = require('domain');
var d = domain.create();
d.on("error",function(err){
  logger.error(err.message);
})
d.run(function(){
  app.use("/test",require("./routes")(express.Router()));
  //require("./routes")(app);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    console.log("11111")
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  console.log("222222")
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
