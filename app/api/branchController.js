var Branch = require("../models/branch");
var User = require("../models/user");
var Promise = require("bluebird");
var _  = require("underscore");
var logger = require("../utils/log/cntrlLog");
var mandatoryParamFilter = require("../filters/mandatoryParamFilter");
var actionComposer = require("./actionComposer");

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

    getShareInformation: actionComposer({
        beforeFilters: [mandatoryParamFilter(["id"])],
        action: function(req, resp) {
            logger.debug("get share info started " + req.params);
            Branch.forge({id: req.query.id}).getShareInformation().then(function(data) {
                logger.info("share data for branch: " + req.query.id + " data:" + JSON.stringify(data));
                data.owners.splice(_.findIndex(data.owners, function(owner){return owner.id === req.session.userId}));
                resp.json(data);
            });
        }
    }),

    //todo: notification is send even if branch share failed
    share: function(req,resp){
        logger.info("save share info for branch started " + res.body);
        var promises =[];
        if(req.body.id){
            req.body.users.forEach(function(user_id){
                promises.push(Branch.forge({id: req.body.id}).shareSecure(req.session.userId, user_id, req.body.ownership));
                promises.push(notificationService.branchShareNotification([req.body.id ,req.session.userId] ,user_id));
            });
            Promise.all(promises).then(function(){
                logger.info("branch %d was shared with user ", req.body.id);
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
        (function(){if(req.body.branch.id){
            return Branch.forge(req.body.branch).save()
        } else {
            return User.forge({id : req.session.userId}).related("branches").create(Branch.forge(req.body.branch));
        }})().then(function(){
            resp.sendStatus(200);
        })
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