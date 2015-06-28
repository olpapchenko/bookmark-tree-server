var path = require('path');

module.exports.static = require("express").static(path.resolve(__dirname, "../", "./public"));
module.exports.views = require("express").static(path.resolve(__dirname, "../", "./views"));