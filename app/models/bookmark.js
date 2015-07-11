var bookshelf = require ('../../config/db/bookshelf');

var Comment = require('./comment');
var User = require('./user');
var Marker = require('./marker');
var Rights = require('./rights');
var _ = require("underscore");

bookmark = bookshelf.Model.extend({
    tableName: "bookmarks",

    comments: function () {
        return this.hasMany("Comment");
    },

    markers: function () {
        return this.hasMany("Marker");
    },

    users: function () {
        return this.belongsToMany(User).through(Rights);
    },

    rights: function ( ) {
        return this.hasMany("Right");
    }

}, {

        getByUserId: function (userId, rights) {
            rights = rights || {read: true};
           return  Rights.forge(_.extend(rights, {user_id: userId})).fetchAll({withRelated: ["bookmark"]})
               .then(function(rights) {
                   if(rights) {
                      return rights.map(function (r){return r.related("bookmark")});
                   }
               });
        },

        getById: function (id, userId, rights) {
            rights = rights || {read: true};
           return  Rights.forge(_.extend(rights, {user_id: userId, bookmark_id: id}))
               .fetch({withRelated:  ["bookmark"]})
               .then(function (right) {
                   return rights != null ? right.related("bookmark"): null;
               });
        },
        create: function(bookmark, userId) {
           return  user.forge({id: userId}).then(function(user){
                user.attach(new bookmark(bookmark));
            });
        },

        update: function(bookmark,userId){
            getById(bookmark.id,userId, {write: true}).then(function(model) {
                if(model) {
                    model.set(bookmark);
                    return model.save();
                }else {
                    return null;
                }
            });
        }
    }
);

module.exports = bookshelf.model("Bookmark", bookmark);
