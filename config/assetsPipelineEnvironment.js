var mincer = require('mincer'),
    app_config = require("./app_config");

var mincerEnvironment = new mincer.Environment();
mincerEnvironment.appendPath(app_config.assetsPath);

if(app_config.mode == "production") {
    mincerEnvironment.jsCompressor  = 'uglify';
}

module.exports = mincerEnvironment;
