var _ = require("underscore");
var Promise = require("bluebird");

var logger = require("../utils/log/cntrlLog");
var Branch = require("../models/branch");
var Bookmark = require("../models/bookmark");
var User = require("../models/user");
var BookmarkRights = require("../models/bookmarkRights");

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
        Branch.forge({id: req.query.id}).bookmarks().fetch().then(function (bookmarks) {
            resp.json(bookmarks.toJSON({omitPivot: true}));
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
        return Bookmark.persist(_.pick(req.body, "id", "name", "comments", "markers", "branch_id"), req.session.userId).then(function(res){
            resp.sendStatus(200);
        });
    }
});

module.exports.remove = actionComposer({
    beforeFilters: [validateBookmarkOwnership],
    action: function (req, resp) {
        Bookmark.forge({id : req.body.id}).destroy().then(function() {
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

        Promise.all([ BookmarkRights.updateBookmarkRight(req.body, function(isSaved, userId) {
            if(isSaved) {
                console.log("is save " + isSaved);
                return User.forge({id: userId}).addBookmarkToDefaultBranch(req.body.id);
            } else if (isSaved == null){
                console.log("is save " + isSaved);
                return User.forge({id: userId}).removeBookmarkFromDefaultBranch(req.body.id);
            }
        })
        ]).then(function () {
                resp.status(200).send("Bookmark rights are changed");
        });
    }
})