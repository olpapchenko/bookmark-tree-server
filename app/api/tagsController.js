var Tags = require("../models/tags");
var User = require("../models/user");

var actionComposer = require("./actionComposer");
var mandatoryParamFilter = require("../filters/mandatoryParamFilter");

module.exports.all = function (req, resp) {
    User.forge({id: req.session.userId}).tags().fetch().then(function (tags) {
        console.log(tags.size());
        resp.json(tags);
    })
}

module.exports.post = actionComposer({
    beforeFilters: [mandatoryParamFilter(["tag"])],
    action: function (req, resp) {
        return User.forge({id: req.session.userId}).tags().create(req.body.tag).then(function () {
            resp.sendStatus(200);
        });
 }
});


module.exports.remove = actionComposer({
    beforeFilters: [mandatoryParamFilter(["id"])],
    action: function (req, resp) {
        return Tags.forge({user_id: req.session.userId, id: req.body.id}).destroy().then(function () {
            resp.sendStatus(200);
        })
    }});

module.exports.attachToBookmark = actionComposer({
    beforeFilters: [mandatoryParamFilter(["bookmark_id", "tag_id"])],
    action: function (req, resp) {
        return User.forge({id: req.session.userId}).bookmarkOwner(req.body.bookmark_id).fetchOne().then(function (bookmark) {
            if(bookmark) {
                return bookmark.tags().attach(req.body.tag_id).then(function () {
                   resp.sendStatus(200);
                });
            } else {
                resp.status(400).send("Bookmark was not found");
            }
        });
    }
});


module.exports.detachFromBookmark = actionComposer({
    beforeFilters: [mandatoryParamFilter(["bookmark_id", "tag_id"])],
    action: function (req, resp) {
        return User.forge({id: req.session.userId}).bookmarkOwner(req.body.bookmark_id).fetchOne().then(function (bookmark) {
            if(bookmark) {
                return bookmark.tags().detach(req.body.tag_id).then(function () {
                    resp.sendStatus(200);
                });
            } else {
                resp.status(400).send("Bookmark was not found");
            }
        });
    }
});