var bookshelf = require ('../../config/db/bookshelf');
var Promise = require("bluebird");
var Bookshelf = require("../../config/db/bookshelf");

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
        return this.belongsToMany("User").through("Right");
    },

    rights: function ( ) {
        return this.hasMany("Right");
    },

    branch: function(){
        return this.belongsTo("Branch");
    },
    share: function(userId){
        return this.related("users").attach(User.forge({id: userId})).then(
            function(){
                return "bookmark successfully shared";
            },
            function(){
                return "please report issue, bookmark was not shared";
            }
        );
    },

    unshare: function(userId) {
        return this.related("users").detach(User.forge({id: userId})).then(
            function(){
                return "bookmark successfully unshared";
            },
            function(m){
                if(m.message == "EmptyResponse"){
                    return "bookmark was not shared, so you can not unshare it"
                }
                return "please report issue, bookmark was not unshared";
            }
        )
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
                   return right != null ? right.related("bookmark").load(['comments', 'markers']): null;
               });
        },

        persist: function(bookmark, userId, rights) {
            rights = rights || {read: true, write: true};
           var bookmarks  = [].concat(bookmark);
           _this = this;
           return  Bookshelf.transaction(function(t) {
                 return Promise.map(bookmarks, function (bookmark) {
                     return User.forge(userId)
                        .load(["defaultBranch"])
                        .then(function(user) {
                                bookmark.branch_id = bookmark.branch_id || user.related("defaultBranch").models[0];
                                return bookmark;})
                     .then(function(bookmark) {
                         return  _this.forge(_.omit(bookmark, "comments", "markers"))
                             .save(null,{transacting: t})
                             .tap(function(model){
                                 return User.forge({id: userId}).fetch({require: true}).then(function(user){
                                     user.bookmarks().attach(model,{transacting: t});
                                 });
                             })
                     .tap(function(model) {
                         if(!bookmark.comments){
                             return;
                         }
                         return Promise.map(bookmark.comments, function (comment) {
                             console.log(JSON.stringify(comment)  + " comment");
                             return Comment.forge(comment).save({bookmark_id: model.id}, {transacting: t});
                         });
                     })
                     .tap(function(model){
                         if(!bookmark.markers){
                             return;
                         }
                         return Promise.map(bookmark.markers, function (marker){
                             return Marker.forge(marker).save({bookmark_id: model.id}, {transacting: t});
                         });
                     });

                     });
               });
            }).then(function(p){return p.length > 1 ? p : p[0]});
        }
    }
);

module.exports = bookshelf.model("Bookmark", bookmark);

