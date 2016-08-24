var _ = require("underscore");
var Promise = require("bluebird");

var bookshelf = require ('../../config/db/bookshelf');
var encodeSHA = require("../helpers/encodeSHA");
var Bookmark = require('./Bookmark');
var Rights = require('./BookmarkRights');
var Branch = require('./Branch');
var Preference = require("./preferences");
var BookmarksBranches = require('./BookmarksBranches');
var Tag = require("./tags");

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

    bookmarkOwner: function (id) {
      return this.bookmark(id).query(function (qb) {
          qb.where("owner", true);
      })
    },

    tags: function () {
        return this.hasMany("Tag");
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

    preferences: function () {
      return this.hasMany("Preference");
    },

    defaultBranch: function() {
        return this.branches().query({where: {default: true}});
    },

    friends: function(){
        return this.belongsToMany("User", "friends", "user_id", "friend_id");
    },

    reverseFriends: function () {
        return this.belongsToMany("User", "friends", "friend_id", "user_id");
    },

    allFriends: function () {
        var _this = this;
        function friends () {
            return _this.friends();
        }

        function reverseFriends () {
            return _this.reverseFriends();
        }
        return Promise.map([friends, reverseFriends], function (friends) {
            return friends().fetch();
        }, {concurrency: 2}).then(function (friends) {
            return friends[0].models.concat(friends[1].models).map(function (friend) {return _.omit(friend, "password")});
        });
    },

    removeFriend: function (friendId) {
        return Promise.all(this.related("friends").detach(user.forge({id: friendId})),
            user.forge({id: friendId}).related("friends").detach(this));
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
            }).filter(function (friend) {
                return friend.id != _this.id;
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

    origin: {
        bookmarktree: 1,
        google: 2,
        facebook: 3,
        vkontacte: 4
    },

    login: function (mail, password) {
        return new this({mail: mail}).fetch().then(function (user) {
            if (user) {
                return user.get("password") == encodeSHA(password) ? user.omit("password") : null;
            } else
                return null;
        });
    },

    register: function (userData){
        var userToSave = _.extend({}, userData);
        userToSave.password =  userData.origin == user.origin.bookmarktree ? encodeSHA(userData.password) : encodeSHA(String(Math.random() * 100000));
        return new this(userToSave).save();
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
