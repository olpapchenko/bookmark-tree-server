var User = require("../models/user");
var Bookmark = require("../models/bookmark");
var Branches = require("../models/branch");
var Promise = require("bluebird");

var _ = require("underscore");

module.exports = {
    get: function(req, resp) {
        User.forge({id: req.session.userId}).load(["friends"]).then(function(user){
            resp.json(user.related("friends").map(function(item){return item.omit("password")}));
        });
    },
    post: function(req, resp) {
        User.forge({id: req.session.userId}).related("friends").create(User.forge({id: req.body.id})).then(function(){
            resp.sendStatus(200);
        });
    },
    remove: function(req, resp) {
        User.forge({id: req.session.userId}).related("friends").detach(User.forge({id: req.body.id})).then(function() {
            resp.sendStatus(200);
        })
    },

    shared: function(req, resp){
        var sharedResults = {};
        Promise.all([
            Bookmark.getShared(req.session.userId, req.params.id),
            Branches.getShared(req.session.userId, req.params.id)]
         ).then(function(data){
            sharedResults.bookmarks =  data[0] || [];
            sharedResults.branches =  data[1] || [];
            resp.json(sharedResults);
        });
    }
}