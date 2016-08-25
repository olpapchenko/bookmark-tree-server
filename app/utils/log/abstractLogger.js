var path = require("path");
var winston = require("winston");
var appConfig = require("../../../config/app_config");
//todo: pass name of source
function getLogPath (fileName) {
    return path.join(appConfig.logDir, fileName);
}

function getTransport (options) {
    var transport = [];
    transport.push(new (winston.transports.Console)());

    if(options.file) {
        transport.push(new (winston.transports.File)({ filename: getLogPath(options.file),
            level: appConfig.mode === "dev" ? "debug" : "error",
            json: false,
            humanReadableUnhandledException: true,
            handleExceptions: true
        }));
    }
    return transport;
}

module.exports.getLogPath = getLogPath;

module.exports.getLogger = function (options) {
    var logger = new (winston.Logger)({
        transports: getTransport(options.transport)
    });
    return logger;
}