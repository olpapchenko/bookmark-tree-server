var abstractLogger = require ("abstractLogger");
var LOG_FILE = "modelLog.log";

module.exports = abstractLogger.getLogger({transport: {file: LOG_FILE}});
