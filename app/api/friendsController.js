var User = require("../models/user");
var _ = require("underscore");

module.exports = {
    get: function(req, resp) {
        User.forge({id: req.session.userId}).load(["friends"]).then(function(user){
            resp.json(user.related("friends").map(function(item){return item.omit("password")}));
        });
    },
    post: function(req, resp) {
        console.log("asdfasdfasdfasdf");
        User.forge({id: req.session.userId}).related("friends").create(User.forge({id: req.body.id})).then(function(){
            resp.sendStatus(200);
        });
    }
}