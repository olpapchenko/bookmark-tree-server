var abstractLogger = require ("./abstractLogger");
var LOG_FILE = "services.log";

module.exports = abstractLogger.getLogger({transport: {file: LOG_FILE}});