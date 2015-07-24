var Notification = require("../models/notification");
var Bookmark = require("../models/bookmark");

module.exports = {
    notificationTypes: {
        bookmarkShareNotificaiton: {
                                    id: 0,
                                    isMail: false,
                                    text: function(bookmarkId){
                                        Bookmark.forge({id: bookmarkId}).fetch()
                                            .then(function(model){
                                                return "Bookmark " + model.get("name") + " was shared with you. "
                                            });
                                    }
        },
        bookmarkEditNotification: {
                                    id: 1,
                                    isMail: false,
                                    text: function(bookmarkId){
                                        Bookmark.forge({id: bookmarkId}).fetch()
                                            .then(function(model){
                                                return "Bookmark " + model.get("name") + " was edited. "
                                            });
                                    }
        },
        bookmarkRemove: {
                         id: 2,
                         isMail: false,
                         text: function(bookmarkId){
                                            Bookmark.forge({id: bookmarkId}).fetch()
                                                .then(function(model){
                                                    return "Bookmark " + model.get("name") + " was removed. "
                                                });
                                               }
                                        }
    },
    sendMail: function() {
        //todo: send mail here
    },
    getNotificationText: function(notificationType, bookmarkId) {
        for (var type in notificationTypes) {
            if (notificationTypes.hasOwnProperty(type)) {
                if (type.id == notificationType) {
                    return type.text(bookmarkId);
                }
            }
        }
    },
    sendNotification: function(notificationType, userId) {
        if(notificationType.isMail) {
            sendMail(notificationType, bookmarkId, userId);
        return Notification.forge({type: notificationType.id, user_id: userId}).save();
        }
    }
}