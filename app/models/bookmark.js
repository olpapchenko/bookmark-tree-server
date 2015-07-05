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
                   console.log(rights.at(0).related("bookmark"));
                  return rights.map(function (r){return r.related("bookmark")});
               }
           });
    },

    getById: function (userId, id, rights) {
        rights = rights || {read: true};
       return  Rights.forge(_.extend(rights, {user_id: userId, bookmark_id: id}))
           .fetch({withRelated:  ["bookmark"]})
           .then(function (right) {
               return rights != null ? right.related("bookmark"): null;
           });
    }
});

module.exports = bookshelf.model("Bookmark", bookmark);
