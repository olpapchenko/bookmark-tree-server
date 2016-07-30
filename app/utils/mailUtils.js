var nodemailer = require('nodemailer');
var _ = require("underscore");
var Promise = require('bluebird');

var appConfig = require("../../config/app_config");
var encodeSHA = require("../helpers/encodeSHA");
var log = require("./log/servicesLog");

var smtpConfig = {
    host: appConfig.smtpHost,
    port: 465,
    secure: true, // use SSL
    auth: {
        user: appConfig.smtpUser,
        pass: appConfig.smtpHost
    }
};
var transporter = nodemailer.createTransport(appConfig.smtp);

module.exports.sendMail = function (mailText, subject, mailAddress) {
    var opts = {
        html: mailText,
        subject: subject,
        to: mailAddress,
        from: "BookmarkTree"
    }
    return new Promise(function (resolve, reject) {

        transporter.sendMail(opts, function(error, info){
            if(error){
                log("error occurred while sending verification mail");
                reject(error);

            }

            log.info("verification mail was successfuly delivered");
            resolve(info);
        });

    });
}

module.exports.encodeMailVerificationKey = function (data) {
    var encodedData = {
        salt: appConfig.salt
    }

    _.extend(encodedData, data);

    var unencodedString = JSON.stringify(data);
    return encodeSHA(unencodedString);
}

module.exports.getMailVerificationLinkForFB = function (data) {
    return appConfig.baseUrl + appConfig.fbMailVerificationPath + "?key=" + module.exports.encodeMailVerificationKey(data);
}