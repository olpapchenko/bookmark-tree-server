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
                log.error("error occurred while sending verification mail");
                log.error(error);
                reject(error);
            }

            log.info("verification mail was successfuly delivered");
            resolve(info);
        });

    });
}

module.exports.encodeMailVerificationKey = function (data) {
    return encodeSHA(data.mail + appConfig.salt);
}

module.exports.getMailVerificationLinkForFB = function (data) {
    'use strict';
    var encodedName = encodeURIComponent(data.name),
        encodedMail = encodeURIComponent(data.mail),
        encodeFacebookId = encodeURIComponent(data.facebook_id),
        key = encodeURIComponent(module.exports.encodeMailVerificationKey(data));


    return appConfig.baseUrl + appConfig.fbMailVerificationPath + `?key=${key}&name=${encodedName}&mail=${encodedMail}&facebook_id=${encodeFacebookId}`;
}