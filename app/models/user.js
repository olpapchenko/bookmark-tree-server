var bookshelf = require ('../../config/db/bookshelf');
var encodeSHA = require("../helpers/encodeSHA");
var Bookmark = require('./bookmark');
var Rights = require('./bookmarkRights');
var Branch = require('./branch');


var omitPassword = function (item) {
    return item.omit("password");
}

var user = bookshelf.Model.extend({

    tableName: 'users',

    bookmarks: function () {
        return this.belongsToMany("Bookmark").through("Bookmark_rights");
    },
    bookmark: function(id) {
        return this.belongsToMany("Bookmark").through("Bookmark_rights").query({where: {id: id}});
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
    defaultBranch: function() {
        return this.branches().query({where: {default: true}});
    },
    friends: function(){
        return this.belongsToMany("User", "friends", "user_id", "friend_id");
    },
    notifications: function(){
        return this.hasMany("Notification");
    },
    isFrineds: function(users) {
        _this = this;
       return this.load("friends").then(function() {
            return users.map(function(friend){
                if(_this.related("friends").any(function(user){
                    return user.id == friend.id;
                })){
                    friend.isFriend = true;
                };
                return friend;
            });
        });
    },

    addBookmarkToDefaultBranch: function (bookmarkId) {
        return this.defaultBranch().fetchOne().then(function (defaultBranch) {
            return defaultBranch.bookmarks().attach(bookmarkId);
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
                  mail: userData.mail}).save()
        .then(function  (model) {
           return model.omit("password");
        });
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
