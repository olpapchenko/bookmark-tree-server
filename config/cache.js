var cache  = require("node-cache");

module.exports  = new cache({stdTTL: 5 * 24 * 3600, checkperiod: 3600});
