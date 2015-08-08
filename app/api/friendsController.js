var User = require("../models/user");

module.exports = {
    get: function(req, resp) {
        User.forge({id: req.session.userId}).load(["friends"]).then(function(user){
            resp.json(user.related("friends"));
        });
    }
}