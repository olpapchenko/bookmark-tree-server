var mincer = require('mincer'),
    appConfig = require("./app_config"),
    path = require('path');

mincer.logger.use(console);

var mincerEnvironment = new mincer.Environment();
mincerEnvironment.appendPath(appConfig.assetsPath);

if(appConfig.mode == "production") {
    mincerEnvironment.jsCompressor  = 'uglify';
    mincerEnvironment.cssCompressor = 'csso';
}

var constructPath = function (path) {
    return ("/assets" + path).replace(/\\/g, "/");
}

mincerEnvironment.getAssetPath = function (asset, options) {
    return  constructPath(mincerEnvironment.findAsset(asset, options).digestPath);
}

mincerEnvironment.ContextClass.defineAssetPath(function (pathname, options) {
    var asset = this.environment.findAsset(pathname, options);

    if (!asset) {
        throw new Error('File ' + pathname + ' not found');
    }

    return  constructPath(asset.digestPath);
});

module.exports = mincerEnvironment;
