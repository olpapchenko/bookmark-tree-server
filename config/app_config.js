var path = require('path');

module.exports.mode = "dev";

module.exports.static = require("express").static(path.resolve(__dirname, "../", "./public"));

module.exports.views = require("express").static(path.resolve(__dirname, "../", "./views"));

module.exports.salt="GameOfThrones";

module.exports.logDir = path.resolve("./logs");

module.exports.avatarDir = path.resolve("./uploads/avatars");

module.exports.sessionsPath = path.resolve(__dirname, "../sessions");