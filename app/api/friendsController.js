var User = require("../models/user");
var Bookmark = require("../models/bookmark");

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
        Bookmark.getShared(req.session.userId, req.params.id).then(function(bookmark){
            sharedResults.sharedBookmarks = bookmark;
            resp.json(sharedResults);
        });
    }
}