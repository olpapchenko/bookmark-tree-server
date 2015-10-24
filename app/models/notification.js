var Bookshelf = require ('../../config/db/bookshelf');

var User = require("./user");

var CACHE_PREFIX = "NOTIFICATION";

var notification = Bookshelf.Model.extend({
    tableName: "notifications",

    user: function() {
        return this.belongsTo("User");
    },

    markRead: function () {
        return this.save({is_read: true});
    }
}, {
    getCacheKey: function (userId) {
        return CACHE_PREFIX + userId;
    },

    markAllRead: function (userId) {
        return User.forge({id: userId}).unreadNotifications().map(function (notification) {
            return notification.markRead();
        });
    },

    getObjectForCacheStore: function (id) {
        return User.forge({id: id}).unreadNotifications().fetch();
    }
});

module.exports = Bookshelf.model("Notification", notification);