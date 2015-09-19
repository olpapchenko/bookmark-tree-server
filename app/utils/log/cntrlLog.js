var abstractLogger = require ("./abstractLogger");
var LOG_FILE = "controllerLog.log";

module.exports = abstractLogger.getLogger({transport: {file: LOG_FILE}});
