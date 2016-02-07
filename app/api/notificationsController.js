var Promise = require("bluebird");

var notifications = require("../models/notification");
var user = require("../models/user");
var notificationService = require("../helpers/notificationService");

module.exports = {

    //uses cache store; returns only unread questions
    getUnread: function(req, resp){
        notificationService.getAllByUserId(req.session.userId).then(function (notifications) {
            resp.send(notifications);
        })
    },

    getUnreadCount: function (req, resp) {
        notificationService.getAllByUserId(req.session.userId).then(function (notifications) {
            resp.json({size: notifications.length});
        });
    },

    read: function(req, resp){
        notificationService.markAllRead(req.session.userId).then(function () {
            resp.sendStatus(200);
        });
    },

    all: function (req, resp) {
        user.forge({id: req.session.userId}).notifications().fetch().then(function(notifications){
            resp.send(notifications);
        })
        .then(function () {
            notificationService.markAllRead(req.session.userId);
        });
    }
}