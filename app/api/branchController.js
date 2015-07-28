var Branches = require("../models/branch");
var User = require("../models/user");

module.exports={

    all: function(req, resp){
        User.forge({id: req.session.userId}).load(["branches"]).then(function(user){
            resp.json(user.related("branches").models);
        });
    },

    get: function(req, resp){

        if(!req.params.id){
            resp.status(400).send("id must be provided");
        }

        User.forge({id: req.params.id, user_id: req.session.userId}).fetch(
            function(model){
                resp.json(model);
            }
        );
    },
    post: function(req,resp){
        Branches.forge(req.body.branch).then(function(model){
            resp.json(model);
        });
    }
}