var Branches = require("../models/branch");

module.exports={
    get: function(req, resp){

        if(!req.params.id){
            resp.status(400).send("id must be provided");
        }

        Branches.forge({id: req.params.id, user_id: req.session.userId}).fetch(
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