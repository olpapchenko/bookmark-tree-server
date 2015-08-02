var express = require('express');
var path = require('path');
var app_config = require("../config/app_config");
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require("../config/routes");
//
var session = require("express-session");
var FileStore = require("session-file-store")(session);

//filters
var authorizeFilter = require("./filters/authorizeFilter");

var app = express();

// static files
app.use(app_config.views);
app.use(app_config.static);

//session store
app.use(session({
  store: new FileStore({ttl: 3600*24*30, reapInterval: 3600}),
  resave: false,
  saveUninitialized: true,
  secret: app_config.salt,
  maxAge: 1000*60*60*24*500
}));

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//authorize filter
app.use(/^(?!\/login|\/logout|\/registration)/, authorizeFilter);

//register routes
app.use("/",routes);

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
    console.log("errr " + err.message);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  console.log("errrp " + err.message);
});



module.exports = app;
