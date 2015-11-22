var _ = require("underscore");

var bookshelf = require ('../../config/db/bookshelf');
var encodeSHA = require("../helpers/encodeSHA");
var Bookmark = require('./bookmark');
var Rights = require('./bookmarkRights');
var Branch = require('./branch');
var Preference = require("./preferences");
var BookmarksBranches = require('./BookmarksBranches');

var BookmarksBranches = bookshelf.model("BookmarksBranches");

var omitPassword = function (item) {
    return item.omit("password");
}

var user = bookshelf.Model.extend({

    tableName: 'users',

    bookmarks: function () {
        return this.belongsToMany("Bookmark").through("Bookmark_rights");
    },

    bookmark: function(id) {
        return this.bookmarks().query(function(qb){
            qb.where("bookmarks.id", id);
        })
    },
    rights: function () {
        return this.hasMany("Bookmark_rights");
    },

    branches: function() {
        return this.belongsToMany("Branch").through("Branch_rights");
    },

    branch: function(id){
        return this.branches().query(function(qb){
            qb.where("branches.id", id);
        })
    },

    preference: function () {
      return this.hasOne("Preference");
    },

    defaultBranch: function() {
        return this.branches().query({where: {default: true}});
    },

    friends: function(){
        return this.belongsToMany("User", "friends", "user_id", "friend_id");
    },

    notifications: function(){
        return this.hasMany("Notification").query(function(qb){
            qb.orderBy('created_at', 'desc');
        });
    },

    unreadNotifications: function () {
        return this.notifications().query({where: {is_read: false}});
    },

    loadUser: function () {
        return this.fetch().then(function (user) {
                return omitPassword(user);
        })
    },

    isFriend: function(users) {
        _this = this;
       var usersArray = [];

        if(users instanceof Array) {
            usersArray = users;
        } else {
            usersArray.push(users);
        }

       return this.load("friends").then(function() {
            return usersArray.map(function(friend){
                if(_this.related("friends").any(function(user){
                    return user.id == friend.id;
                })){
                    friend.isFriend = true;
                } else {
                    friend.isFriend  = false;
                };
                return friend;
            });
        }).then(function (friends) {
           return users instanceof Array ? friends : friends [0];
       });
    },

    addBookmarkToDefaultBranch: function (bookmarkId) {
        var _this = this;
        return this.defaultBranch().fetchOne().then(function (defaultBranch) {
            return BookmarksBranches.forge({bookmark_id: bookmarkId, branch_id: defaultBranch.id, user_id: _this.id}).save();
        })
    },

    removeBookmarkFromDefaultBranch: function (bookmarkId) {
        return this.defaultBranch().fetchOne().then(function (defaultBranch) {
            return defaultBranch.bookmarks().detach(bookmarkId);
        });
    }
}, {
    login: function (mail, password) {
        return new this({mail: mail}).fetch().then(function (user) {
            if (user) {
                return user.get("password") == encodeSHA(password) ? user.omit("password") : null;
            } else
                return null;
        });
    },

    register: function (userData){
        return new this({name: userData.name,
                  password: encodeSHA(userData.password),
                  about: userData.about,
                  mail: userData.mail}).save();
    },

    byName: function(name){
        return this.query(function(qb) {
            qb.where(bookshelf.knex.raw("lower(name)"), "like", name.toLowerCase()+"%").limit(10).orderBy("name");
        })
        .fetchAll()
        .then (function (users){
            return users.map(omitPassword);
        });
    }
});

module.exports = bookshelf.model("User", user);
