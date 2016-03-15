var fs = require("fs"),
    path = require("path"),
    ncp = require("ncp").ncp,
    mincer = require("mincer"),
    environment = require("./assetsPipelineEnvironment"),
    appConfig = require("./app_config");

var movedFiles = ["bundles/fonts"];

var moveFiles = function (files) {
    files.forEach(function (file) {
        ncp(path.join(appConfig.assetsPath, file), path.join(appConfig.compiledAssetsPath, file), function(err) {
            if(err) {
                console.log(err);
            }
            console.log("successfully moved files count:" + files.length);
        });
    });
}
var manifest = new mincer.Manifest(environment, appConfig.compiledAssetsPath);

module.exports.compile = function () {
    try{
        var compiled = manifest.compile([/(js)$|(css)$/], {
            compress: true,
            sourceMaps: true,
            embedMappingComments: true
        });

        moveFiles(movedFiles);

    } catch (e) {
        console.error(e.stack );
    }
};


