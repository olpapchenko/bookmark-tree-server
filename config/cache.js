var cache  = require("node-cache");

var appConfig = require("./app_config");

module.exports  = new cache({stdTTL: appConfig.cacheTTL, checkperiod: appConfig.checkCachePeriod});
