var fs = require("fs"),
    path = require("path"),
    mincer = require("mincer"),
    environment = require("./assetsPipelineEnvironment"),
    appConfig = require("./app_config");

var manifest = new mincer.Manifest(environment, appConfig.compiledAssetsPath);

try{
    var compiled = manifest.compile([/(js)$|(css)$/], {
        compress: true,
        sourceMaps: true,
        embedMappingComments: true
    });
} catch (e) {
    console.error(e.stack );
}


