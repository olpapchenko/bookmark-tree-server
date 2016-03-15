var Promise = require("bluebird");

var notifications = require("../models/notification");
var user = require("../models/user");
var notificationService = require("../helpers/notificationService");
var actionComposer = require(".actionComposer");

module.exports = {

    //uses cache store; returns only unread questions
    getUnread: actionComposer({action:function(req, resp){
        return notificationService.getAllByUserId(req.session.userId).then(function (notifications) {
            resp.send(notifications);
        })
    }}),

    getUnreadCount: actionComposer({action:function (req, resp) {
        return notificationService.getAllByUserId(req.session.userId).then(function (notifications) {
            resp.json({size: notifications.length});
        });
    }}),

    read: actionComposer({action:function(req, resp){
        return notificationService.markAllRead(req.session.userId).then(function () {
            resp.sendStatus(200);
        });
    }}),

    all: actionComposer({action:function (req, resp) {
        return user.forge({id: req.session.userId}).notifications().fetch().then(function(notifications){
            resp.send(notifications);
        })
        .then(function () {
            notificationService.markAllRead(req.session.userId);
        });
    }})
}