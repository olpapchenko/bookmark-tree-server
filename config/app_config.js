var path = require('path');

module.exports.mode = "dev";

// time in milliseconds
module.exports.sessionMaxAge = 1000*60*60*24*500;

//time in seconds
module.exports.sessionReapInterval = 3600;

module.exports.static = require("express").static(path.resolve(__dirname, "../", "./public"));

module.exports.views =  path.resolve(__dirname, "../", "./views");

module.exports.staticResource = require("express").static(path.resolve(__dirname, "../", "./uploads"));

module.exports.salt = "GameOfThrones";

module.exports.cacheTTL = 3500;

module.exports.checkCachePeriod = 3600;

module.exports.logDir = path.resolve("./logs");

module.exports.avatarDir = path.resolve("./uploads/avatars");

module.exports.screenshotsStorage = path.resolve("./uploads/screenshots");

module.exports.defaultAvatarModerate = path.resolve("./public/images/user-moderate.png");

module.exports.defaultAvatarSmall = path.resolve("./public/images/user-small.png");

module.exports.sessionsPath = path.resolve(__dirname, "../sessions");

module.exports.assetsPath = path.resolve("./assets");

module.exports.compiledAssetsPath = path.resolve("./public/assets");