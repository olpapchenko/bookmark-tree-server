var express = require('express');
var mincer = require("mincer");
var path = require('path');
var appConfig = require("../config/app_config");
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require("../config/routes");
var log = require("./utils/log/cntrlLog");
//
var session = require("express-session");
var FileStore = require("session-file-store")(session);

//filters
var authorizeFilter = require("./filters/authorizeFilter");
var mincerEnv = require("../config/assetsPipelineEnvironment");

var app = express();

app.set('view engine', 'ejs');
app.set('views', appConfig.views);
// static files
app.use(appConfig.static);
app.use(appConfig.avatars);

if(appConfig.mode == "dev") {
  app.use("/assets", mincer.createServer(mincerEnv));
}

//session store
app.use(session({
  store: new FileStore({ttl: 3600*24*30, reapInterval: 3600}),
  resave: false,
  saveUninitialized: true,
  secret: appConfig.salt,
  maxAge: 1000*60*60*24*500
}));

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
if(appConfig.mode == "dev") {
  app.use(logger('dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//authorize filter
app.use(/^(?!\/login|\/logout|\/registration|\/user\/mail\/availability|\/$)/, authorizeFilter);

//register routes
app.use("/",routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

 // no stacktraces leaked to user
app.use(function(err, req, res, next) {
  log.error(err.message);
  res.status(500).send("Internal server error");
});

module.exports = app;
