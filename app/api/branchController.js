var Branch = require("../models/branch");
var User = require("../models/user");
var Promise = require("bluebird");
var _  = require("underscore");
var notificationService = require("../helpers/NotificationService");

module.exports={

    all: function(req, resp){
        User.forge({id: req.session.userId}).load(["branches"]).then(function(user){
            resp.json(user.related("branches").toJSON({omitPivot: true}));
        });
    },

    get: function(req, resp) {

        if (!req.params.id) {
            resp.status(400).send("id must be provided");
            return;
        }

        User.forge({id: req.session.userId}).branch(req.params.id).fetch().then(function (m) {
            resp.json(m);
        });
    },
    share: function(req,resp){
        var promises =[];
        if(req.body.id){
            req.body.users.forEach(function(user_id){
                promises.push(Branch.forge({id: req.body.id}).shareSecure(req.session.userId, user_id));
                promises.push(notificationService.branchShareNotification([req.body.id ,req.session.userId] ,user_id));
            });
            Promise.all(promises).then(function(){
                resp.sendStatus(200);
            }, function(){
                resp.sendStatus(500);
            });
        } else{
            resp.status(400).send("Branch or user was not specified");
        }
    },
    unshare: function(req, resp){
        if(req.body.branch_id){
            Branch.forge({id: req.body.branch_id}).unshareSecure(req.session.userId, req.body.user_id).then(
                function(m){resp.send(m)},
                function(m){resp.status(400).send(m)}
            );
        } else{
            resp.status(400).send("Branch or user was not specified");
        }
    },
    post: function(req,resp){
        Branch.forge(req.body.branch).save().then(function(model){
            resp.json(model);
        });
    },
    remove: function(req, resp){
        if(!req.body.id){
            resp.status(400).send("Branch id is empty.");
            return;
        }

        Branch.forge({id: req.body.id})
        .remove()
        .then(function(model){
            var promises = [];
            model.related("users").forEach(function(user){
                if(req.session.userId != user.id) {
                    promises.push(notificationService.branchRemoveNotification([req.body.id, req.session.userId], user.id))
                };
            });
            return Promise.all(promises);
        })
        .catch(function(e){return e == "defaultBranch"}, function() {
              resp.status(400).message("Can not remove default branch");
        })
        .then(function() {
            resp.sendStatus(200);
        });
    }
}