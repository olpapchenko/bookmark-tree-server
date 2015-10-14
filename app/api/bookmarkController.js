var _ = require("underscore");
var Promise = require("bluebird");

var logger = require("../utils/log/cntrlLog");
var Bookmark = require("../models/bookmark");
var User = require("../models/user");
var BookmarkRights = require("../models/bookmarkRights");

var mandatoryParamFilter = require("../filters/mandatoryParamFilter");
var ensureBookmarkExist = require("../filters/ensureBookmarkExist");
var validateBookmarkOwnership = require("../filters/validateBookmarkOwnership");


var actionComposer = require("./actionComposer");

module.all = function (req, resp) {
    Bookmark.getByUserId(req.session.userId).then(function(bookmarks){
        resp.json(bookmarks);
    });
}

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

module.exports.post = function (req, resp) {
    Bookmark.persist(_.pick(req.body.bookmark, "id", "name", "comments", "markers", "branch_id"), req.session.userId).then(function(res){
        if(res) {
            resp.sendStatus(200);
        }else {
            resp.status(403).send("You have no right to edit this bookmark");
        }
    }, function (t) {
        console.log(t);
    });
}

module.exports.remove = function (req, resp) {
    if(!req.body.id) {
        resp.status(400).send("id is not provided");
        return;
    }
    Bookmark.forge({id : req.body.id}).destroy().then(function() {
        resp.send("successfully removed");
    })
}

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