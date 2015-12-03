var mincer = require('mincer'),
    appConfig = require("./app_config"),
    path = require('path');

var mincerEnvironment = new mincer.Environment();
mincerEnvironment.appendPath(appConfig.assetsPath);

if(appConfig.mode == "production") {
    mincerEnvironment.jsCompressor  = 'uglify';
}

mincerEnvironment.ContextClass.defineAssetPath(function (pathname, options) {
    var asset = this.environment.findAsset(pathname, options);

     if (!asset) {
        throw new Error('File ' + pathname + ' not found');
    }

    return  path.join("/assets", asset.digestPath).replace(/\\/g, "/");
});

module.exports = mincerEnvironment;
