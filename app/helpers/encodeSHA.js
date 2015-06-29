var crypto = require("crypto");
var salt = require("../../config/app_config").salt;

module.exports = function (word) {
    var Hmac = crypto.createHmac("sha1", salt);
    Hmac.update(word);
    return Hmac.digest("hex");
}