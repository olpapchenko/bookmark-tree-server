var axios = require("axios"),
    promise = require("bluebird"),

    appConfig = require("../../config/app_config"),
    log = require("./log/servicesLog");

var CHECK_USER_TOKEN_URL = "https://graph.facebook.com/debug_token"
var GET_APP_MARKER_URL = "https://graph.facebook.com/oauth/access_token";

module.exports.verifyToken = function (token) {
    return module.exports.getApplicationMarker().then(function (appToken) {
        return axios.get(CHECK_USER_TOKEN_URL, {
            params: {
                input_token: token,
                access_token: appToken
            }
        }).then(function(response){
            return response.data
        }, function (e) {
            log.error("error while validating facebook user token");
            return promise.reject(e);
        });
    });
}

module.exports.getApplicationMarker = function () {

    return axios.get(GET_APP_MARKER_URL, {
        params: {
            client_id: appConfig.auth.facebook.appId,
            client_secret: appConfig.auth.facebook.appSecret,
            grant_type: "client_credentials"
        }
    }).then(function (token) {
        return token.data.replace("access_token=", "");
        log.info("facebook app token successfuly retrived");
    }, function (e) {
        log.error("error occurred while retrieving facebook token");
        return promise.reject(e);
    });
}