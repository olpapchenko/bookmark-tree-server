var path = require('path');

module.export.mode = "dev";

module.exports.static = require("express").static(path.resolve(__dirname, "../", "./public"));

module.exports.views = require("express").static(path.resolve(__dirname, "../", "./views"));

module.exports.salt="GameOfThrones";

module.exports.logDir = "../../log/";

module.exports.sessionsPath = path.resolve(__dirname, "../sessions");