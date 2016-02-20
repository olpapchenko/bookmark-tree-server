var bookshelf = require ('../../config/db/bookshelf');
var Promise = require("bluebird");
var Bookshelf = require("../../config/db/bookshelf");

var AbstractModel = require('./AbstractModel');
var Links = require("./Links");
var Comment = require('./comment');
var User =   require('./user');
var Marker = require('./marker');
var Rights = require('./bookmarkRights');
var BookmarksBranches = require('./BookmarksBranches');
var BookmarkRights = require('./BookmarkRights');

var logger = require("../utils/log/modelLog");

var _ = require("underscore");

bookmark = AbstractModel.extend({
    tableName: "bookmarks",

    comments: function () {
        return this.hasMany("Comment");
    },

    markers: function () {
        return this.hasMany("Marker");
    },

    links: function () {
        return this.hasMany("Link");
    },

    users: function () {
        return this.belongsToMany("User").through("Bookmark_rights");
    },

    user: function(user_id){
        return this.belongsToMany("User").through("Bookmark_rights").query({where: {user_id: user_id}});
    },

    obserwers: function() {
        return this.users().query(function(qb){
            qb.whereRaw("(owner is null or owner = false)");
        })
    },

    owners: function(){
        return this.users().query({where: {owner: true}});
    },

    rights: function () {
        return this.hasMany("Bookmark_rights");
    },

    branches: function(){
        return this.belongsToMany("Branch").through("BookmarksBranches");
    },

    branchOfUser: function(userId) {
      return this.branches().query({where: {user_id: userId}});
    },

    setBranch: function(userId, newBranchId, options) {
        var _this = this;
       return BookmarksBranches.forge({user_id: userId, bookmark_id: _this.id}).saveBasedOnParams({branch_id: newBranchId}, options);
    },

    getShareInformation: function() {
        return Promise.all([this.owners().fetch({columns: ["users.id", "users.name"]}), this.obserwers().fetch({columns: ["users.id", "users.name"]})])
            .then(function(res){
                logger.debug("share results for branch: " + this.id + " res " + res);
                return {owners: res[0].models, observers: res[1].models}
            });
    }
    }, { //todo escape raw variables
        getShared: function(userId, coOwner) {
            var _this = this;
            return  Bookshelf.knex.raw("select distinct(bookmark_id) from bookmark_rights " +
            "                           where user_id = " + coOwner +
                                        " and bookmark_id in (select bookmark_id from bookmark_rights where user_id =" + userId + ")")
                .then(function (res) {
                    return res.rows;
                })
                .map(function (row) {
                    return _this.fetchById(row.bookmark_id, coOwner);
                })
                .map(function (bookmark) {
                    return  bookmark.branchOfUser(userId).fetchOne()
                        .then(function (branch) {
                            return bookmark.set({branch: branch});
                        });
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

        fetchById: function (id, userId, options){
            return this.forge({id: id}).fetch(options)
                .then(function (bookmark) {
                    return BookmarkRights.attachBookmarkRight(bookmark, userId);
                });
        },

        persist: function(bookmark, userId, rights) {
            rights = rights || {read: true, write: true};
           var bookmarks  = [].concat(bookmark);
           _this = this;
           return  Bookshelf.transaction(function(t) {
                 return Promise.map(bookmarks, function (bookmark) {
                     return bookshelf.model("User").forge({id: userId})
                        .load(["defaultBranch"])
                        .then(function(user) {
                                bookmark.branch_id = bookmark.branch_id || user.related("defaultBranch").models[0];
                                return bookmark;})
                     .then(function(bookmark) {
                         return  _this.forge(_.omit(bookmark, "comments", "markers", "branch_id"))
                             .save(null, {transacting: t})
                             .tap(function(model){
                                 if(!bookmark.id) {
                                     return BookmarkRights.forge({user_id: userId, bookmark_id: model.id, owner: true}).save(null, {transacting: t});
                                 }
                                 return ;
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
                         })
                         .tap(function (model) {
                             return model.setBranch(userId, bookmark.branch_id, {transacting: t});
                         });
                     });
               });
            }).then(function(p){return p.length > 1 ? p : p[0]});
        }
    }
);

module.exports = bookshelf.model("Bookmark", bookmark);

