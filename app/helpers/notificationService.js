var Notification = require("../models/notification");
var Branch = require("../models/branch");
var User = require("../models/user");
var Bookmark = require("../models/bookmark");
var Promise = require("bluebird");

module.exports = {
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
    persist: function(message, user_id){
        return Notification.forge({message: message, user_id: userId}).save();
    },
    fetchBookmarkData: function(bookmark, executor, user) {
        Promise.all([
        Bookmark.forge(bookmark).fetch(),
            User.forge(executor).fetch(),
            User.forge(user).fetch()]);

    },
    fetchBranchData: function(branch, executor, user){

    },
    bookmarkShareNotificaiton: function(bookmarkName, user, userId){
        return persist("Bookmark " + bookmarkName + " was shared with you by " + user, userId);
    },
    bookmarkEditNotification: function(bookmarkName, editor, userId){
        return persist("Bookmark " + bookmarkName + " was edited by " + editor, userId);
    },
    bookmarkRemove: function(bookmarkName,remover,userId){
        return persist("Bookmark " + bookmarkName + " was removed by user " + remover, userId);
    },
    branchEdit: function(branchName,editor, userId) {
        return persist("Branch " + branchName + " was edited by " + editor, userId);
    },
    branchShare: function(branchName, user, userId) {
        return persist("Branch " + branchName + " was shared by " + user, userId);
    },
    branchRemove: function(branchName, remover, userId) {
        return persist("Branch " + branchName + " was removed by " + remover, userId);
    }
}