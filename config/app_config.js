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

module.exports.auth = {
    google: {
        clientId: "238683449094-b9flp4812pgjssfo6mn9uoqvniaggi1k.apps.googleusercontent.com"
    },
    facebook: {
        appId: 1658456254475560,
        appSecret: "0301a66d607069999f48edac6ab56efc"
    }
}

module.exports.smtp = 'smtps://bookmarktrees:fwbakohhsfhclyjj@smtp.gmail.com';

module.exports.smtpHost = 'smtp.gmail.com';

module.exports.smtpUser = 'bookmarktrees@gmail.com';

module.exports.smtpPassword = 'fwbakohhsfhclyjj';

module.exports.cacheTTL = 3500;

module.exports.checkCachePeriod = 3600;

module.exports.logDir = path.resolve("./logs");

module.exports.avatarDir = path.resolve("./uploads/avatars");

module.exports.screenshotsStorage = path.resolve("./uploads/screenshots");

module.exports.defaultAvatarModerate = path.resolve("./public/images/user-moderate.png");

module.exports.defaultAvatarSmall = path.resolve("./public/images/user-small.png");

module.exports.sessionsPath = path.resolve(__dirname, "../sessions");

module.exports.assetsJs = require("express").static(path.resolve(__dirname, "../", "./assets/js/app"));

module.exports.assetsVendorJs = require("express").static(path.resolve(__dirname, "../", "./assets/js/vendor"));

module.exports.prodJs = require("express").static(path.resolve(__dirname, "../", "./public/js"));

module.exports.prodVendorJs = require("express").static(path.resolve(__dirname, "../", "./public/js/vendor"));

module.exports.compiledAssetsPath = path.resolve("./public/assets");


module.exports.baseUrl = "http://localhost:3000/";

module.exports.fbMailVerificationPath = "verify/mail/facebook";