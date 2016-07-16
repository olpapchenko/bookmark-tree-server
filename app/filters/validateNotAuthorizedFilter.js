var FilterError = require("./FilterError");

module.exports = function (req) {
    if(req.session.userId) {
        throw new FilterError("you are already logged in");
    }
}