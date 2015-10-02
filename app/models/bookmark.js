var bookshelf = require ('../../config/db/bookshelf');
var Promise = require("bluebird");
var Bookshelf = require("../../config/db/bookshelf");

var Comment = require('./comment');
var User =   require('./user');
var Marker = require('./marker');
var Rights = require('./bookmarkRights');
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
        return this.belongsToMany("User").through("Bookmark_rights");
    },
    user: function(user_id){
        return this.belongsToMany("User").through("Bookmark_rights").query({where: {user_id: user_id}});
    },
    rights: function ( ) {
        return this.hasMany("Bookmark_rights");
    },

    branch: function(){
        return this.belongsTo("Branch");
    },
    shareSecure: function(owner, userId){
        return this.user(owner).fetch().then(function(m){
                if(!m.isEmpty()){
                   return this.attach(User.forge({id: userId}));
                } else {
                    return Promise.reject("You are not eligible to unshare this bookmark!");
                }
            }).then(function(){
                return "Bookmark was shared successfully";
            },
            function(m){
                var message = m.message || m;
                if(message.indexOf("повторяющееся значение") > -1){
                    return "bookmark is already shared";
                }
                return message;
            });
    },

    unshareSecure: function(owner, userId) {
        return this.user(owner).fetch().then(function(m){
                if(!m.isEmpty()) {
                    return this.detach(User.forge({id: userId}));
                } else {
                    return Promise.reject("You are not eligible to unshare this bookmark!");
                }
        }).then(function(){
            return "Bookmark was successfully unshared";
        }, function(m){
            var message = m.message || m;
            if(message == "EmptyResponse"){
                return "You you can not unshare not shared bookmark";
            }
            return message;
        });
    }
}, { //todo escape raw variables
        getShared: function(userId, coOwner) {
            var _this = this;
            return  Bookshelf.knex.raw("select distinct(bookmark_id) from bookmark_rights where user_id = " + coOwner + " and bookmark_id in (select bookmark_id from bookmark_rights where owner = true and user_id =" + userId + ")").then(function(res) {
                var bookmarkPromises = []
                 res.rows.forEach(function(id){
                    bookmarkPromises.push(_this.forge({id: id.bookmark_id}).fetch());
                });
                return Promise.all(bookmarkPromises);
            });
        },

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

