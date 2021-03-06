var Promise = require("bluebird");
var _  = require("underscore");

var logger = require("../utils/log/cntrlLog");

var Branch = require("../models/Branch");
var User = require("../models/user");
var BranchRight = require("../models/branchRights");

var mandatoryParamFilter = require("../filters/mandatoryParamFilter");
var ensureBranchExist = require("../filters/ensureBranchExist");
var validateBranchOwnership = require("../filters/validateBranchOwnership");
var validateBranchNotDefault = require("../filters/validateBranchNotDefault");

var actionComposer = require("./actionComposer");
var notificationService = require("../helpers/NotificationService");

module.exports = {

    all: actionComposer({
        action: function(req, resp){
            return User.forge({id: req.session.userId}).load(["branches"]).then(function(user){
                return BranchRight.attachBranchesRights(user.related("branches").models, req.session.userId);
            }).then(function (branches) {
                resp.json(branches);
            });
        }
    }),

    get: actionComposer({
       beforeFilters: [mandatoryParamFilter(["id"])],
        action: function(req, resp) {
            return User.forge({id: req.session.userId}).branch(req.query.id).fetchOne().then(function (m) {
                resp.json(m);
            });
        }
    }),

    getShareInformation: actionComposer({
        beforeFilters: [mandatoryParamFilter(["id"])],
        action: function(req, resp) {
            logger.debug("get share info started " + req.params);
            return Branch.forge({id: req.query.id}).getShareInformation().then(function(data) {
                logger.info("share data for branch: " + req.query.id + " data:" + JSON.stringify(data));
                data.owners.splice(_.findIndex(data.owners, function(owner){return owner.id === req.session.userId}),1);
                resp.json(data);
            });
        }
    }),

    share: actionComposer({
        beforeFilters: [mandatoryParamFilter(["id"]),
                        ensureBranchExist,
                        validateBranchOwnership,
                        validateBranchNotDefault],
        action: function(req,resp){
            logger.info("save share branch action started " + req.body);
            //notificationService.branchShareNotification({branch: req.body.id, user: 2}, req.session.userId, 1);
            var saveCallback = function (isSaved, userId, branchId, operation) {
                if(operation == "addOwner" && isSaved) {
                    notificationService.branchShareNotificationOwner({branch: branchId, user: req.session.userId}, userId, branchId);
                } else if(operation == "addObserver" && isSaved) {
                    notificationService.branchShareNotificationObserver({branch: branchId, user: req.session.userId}, userId, branchId);
                } else if (operation == "unShare") {
                    notificationService.branchUnShareNotification({branch: branchId, user: req.session.userId}, userId, req.session.userId);
                }
            }

            return BranchRight.updateBranchRights(req.body, saveCallback).then(function () {
                resp.status(200).send("Branch rights are changed");
            });
        }
    }),

    post: actionComposer({
        beforeFilters: [mandatoryParamFilter(["name"]),
                        validateBranchOwnership,
                        validateBranchNotDefault],
        action: function(req,resp){
            var branch = _.pick(req.body, "name", "id");
            return (function(){
                if(branch.id){
                    return Branch.forge(branch).save().then(function (branch) {
                        return branch.users().fetch();
                    })
                    .then(function (users) {
                        users.forEach(function (user) {
                            if(req.session.userId != user.id){
                                notificationService.branchEditNotification({branch: branch.id, user: req.session.userId}, user.id, branch.id);
                            }
                        });
                    });
                } else {
                    return Branch.createBranch(branch, req.session.userId);
            }})()
            .then(function(){
                    resp.sendStatus(200);
            })
        }
    }),

    remove: actionComposer({
        beforeFilters: [mandatoryParamFilter(["id"])],
        action: function(req, resp){
            return Branch.forge({id: req.body.id})
                .fetch({withRelated: "users"})
                .tap(function(model){
                    var promises = [];
                    model.related("users").forEach(function(user){
                        if(req.session.userId != user.id) {
                            promises.push(notificationService.branchRemoveNotification({branch: req.body.id, user: req.session.userId}, user.id, req.session.userId));
                        };
                    });
                    return Promise.all(promises);
                })
                .then(function (model) {
                    return model.remove();
                })
                .catch(function(e){return e == "defaultBranch"}, function() {
                    resp.status(400).message("Can not remove default branch");
                })
                .then(function() {
                    resp.sendStatus(200);
                });
        }
    })

}