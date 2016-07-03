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
app.use(appConfig.staticResource);

if(appConfig.mode == "dev") {
  app.use("/assets", mincer.createServer(mincerEnv));
}

//session store
app.use(session({
  store: new FileStore({ttl: appConfig.sessionMaxAge, reapInterval: appConfig.sessionReapInterval}),
  resave: false,
  saveUninitialized: true,
  secret: appConfig.salt,
  cookie: {maxAge: appConfig.sessionMaxAge},
  rolling: true,
  maxAge: appConfig.sessionMaxAge
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
app.use(/^(?!\/login|\/logout\/logout|\/html|\/images|\/registration|\/js|\/css|\/user\/mail\/availability|\/$)/, authorizeFilter);

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
