var Promise = require("bluebird");


var User = require("../models/user");
var Bookmark = require("../models/Bookmark");
var Branches = require("../models/Branch");
var BranchRights = require("../models/branchRights");
var BookmarkRights = require("../models/BookmarkRights");
var actionComposer = require("./actionComposer");

var _ = require("underscore");

module.exports = {
    get: actionComposer({
        action: function(req, resp) {
        return User.forge({id: req.session.userId}).load(["friends"]).then(function(user){
            resp.json(user.related("friends").map(function(item){return item.omit("password")}));
        });
    }}),
    post: actionComposer({action: function(req, resp) {
        return User.forge({id: req.session.userId}).related("friends").create(User.forge({id: req.body.id})).then(function(){
            resp.sendStatus(200);
        });
    }}),

    remove: actionComposer({action: function(req, resp) {
        return User.forge({id: req.session.userId}).related("friends").detach(User.forge({id: req.body.id})).then(function() {
            resp.sendStatus(200);
        })
    }}),

    shared: actionComposer({action:function(req, resp){
        var sharedResults = {};
        return Promise.all([
            Bookmark.getShared(req.session.userId, req.params.id),
            Branches.getShared(req.session.userId, req.params.id)]
        )
        .then(function (data) {
            sharedResults.bookmarks =  data[0] || [];
            sharedResults.branches =  data[1] || [];
            resp.json(sharedResults);
        });
    }})
}

