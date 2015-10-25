var _ = require("underscore");
var Promise = require("bluebird");

var logger = require("../utils/log/cntrlLog");
var Branch = require("../models/branch");
var Bookmark = require("../models/bookmark");
var User = require("../models/user");
var BookmarkRights = require("../models/bookmarkRights");
var notificationService = require("../helpers/NotificationService");

var mandatoryParamFilter = require("../filters/mandatoryParamFilter");
var ensureBookmarkExist = require("../filters/ensureBookmarkExist");
var validateBookmarkOwnership = require("../filters/validateBookmarkOwnership");
var validateBranchOwnership = require("../filters/validateBranchOwnership")

var actionComposer = require("./actionComposer");

module.exports.all = function (req, resp) {
    Bookmark.getByUserId(req.session.userId).then(function(bookmarks){
        resp.json(bookmarks);
    });
}

module.exports.allByBranch = actionComposer({
    beforeFilters: [mandatoryParamFilter(["id"]),
                    validateBranchOwnership],
    action: function (req, resp) {
        Branch.forge({id: req.query.id}).bookmarks().fetch()
            .then(function (bookmarks) {
                return BookmarkRights.attachBookmarkRights(bookmarks, req.session.userId);
            })
            .map(function(bookmark){
                return bookmark.set({branch: {id: Number(req.query.id)}});
            })
            .then(function (bookmarks) {
                resp.json(bookmarks);
            });
    }

});

module.exports.get = actionComposer({
    beforeFilters: [mandatoryParamFilter(["id"])],
    action: function (req, resp) {
        User.forge({id: req.session.userId}).bookmark(req.query.id).fetchOne().then(function (m) {
            resp.json(m);
        });
    }
});

module.exports.getShareInformation = actionComposer({
    beforeFilters: [mandatoryParamFilter(["id"])],
    action: function(req, resp) {
        logger.debug("get share info started " + req.params);
        Bookmark.forge({id: req.query.id}).getShareInformation().then(function(data) {
            logger.info("share data for branch: " + req.query.id + " data:" + JSON.stringify(data));
            data.owners.splice(_.findIndex(data.owners, function(owner){return owner.id === req.session.userId}),1);
            resp.json(data);
        });
    }
});

module.exports.post = actionComposer({
    beforeFilters: [validateBookmarkOwnership],
    action: function (req, resp) {
        return Bookmark.persist(_.pick(req.body, "id", "name", "comments", "markers", "branch_id"), req.session.userId)
        .then(function(res){
            return Bookmark.forge({id: req.body.id}).users().fetch()
        })
        .then(function (users) {
            var promises = [];

            users.forEach(function (user) {
                if(req.session.userId != user.id) {
                    promises.push(notificationService.bookmarkEditNotification({bookmark: req.body.id, user: req.session.userId}, user.id, req.body.id));
                }
            });
            return Promise.all(promises);
        })
        .then(function () {
            resp.send("Bookmark successfully updated");
        });
    }
});

module.exports.remove = actionComposer({
    beforeFilters: [validateBookmarkOwnership],
    action: function (req, resp) {

        Bookmark.forge({id : req.body.id}).fetch({withRelated: "users"})
            .tap(function (bookmark) {
                var promises = [];
                bookmark.related("users").forEach(function (user) {
                    if(req.session.userId != user.id) {
                        promises.push(notificationService.bookmarkRemoveNotification({bookmark: bookmark.id, user: req.session.userId}, user.id, req.session.userId));
                    }
                });
                return Promise.all(promises);
            })
            .then(function (model) {
                return model.destroy();
            })
            .then(function() {
                resp.send("Successfully removed");
        });
    }
});

module.exports.share =  actionComposer({
    beforeFilters: [mandatoryParamFilter(["id"]),
                    ensureBookmarkExist,
                    validateBookmarkOwnership],
    action: function(req,resp){
        logger.info("save share branch action started " + req.body);

        Promise.all([ BookmarkRights.updateBookmarkRight(req.body, function(isSaved, userId, bookmarkId, operation) {
            if(isSaved) {
                if(operation == "addOwner") {
                    notificationService.bookmarkShareNotificationOwner({bookmark: bookmarkId, user: req.session.userId}, userId, bookmarkId)
                } else if (operation == "addObserver") {
                    notificationService.bookmarkShareNotificationObserver({bookmark: bookmarkId, user: req.session.userId}, userId, bookmarkId);
                }
                logger.info("attach branch  to default branch, userID " + userId);
                return User.forge({id: userId}).addBookmarkToDefaultBranch(req.body.id);
            } else if (isSaved == null){
                notificationService.bookmarkUnShareNotification({bookmark: bookmarkId, user: req.session.userId}, userId, req.session.userId);
                return User.forge({id: userId}).removeBookmarkFromDefaultBranch(req.body.id);
            }
        })
        ]).then(function () {
                resp.status(200).send("Bookmark rights are changed");
        });
    }
})