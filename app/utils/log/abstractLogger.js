var path = require("path");
var winston = require(winston);
var appConfig = require("../../../config/app_config");

function getLogPath (fileName) {
    return path.join(appConfig.logDir, fileName);
}

function getTransport (options) {
    var transport = [];
    if(appConfig.mode === "dev") {
        transport.push(new (winston.transports.Console)());
    }
    if(options.file) {
        new (winston.transports.File)({ filename: getLogPath(options.file)});
    }
    return transport;
}

module.export.getLogPath = getLogPath;

module.exports.getLogger = function (options) {
    var logger = new (winston.Logger)({
        transports: [
            getTransport(options.transport)
        ]
    });
    return logger;
}