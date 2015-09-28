var Promise = require("bluebird");
var _  = require("underscore");

var logger = require("../utils/log/cntrlLog");

var Branch = require("../models/branch");
var User = require("../models/user");
var BranchRight = require("../models/branchRights");

var mandatoryParamFilter = require("../filters/mandatoryParamFilter");
var ensureBranchExist = require("../filters/ensureBranchExist");
var validateBranchOwnership = require("../filters/validateBranchOwnership");

var actionComposer = require("./actionComposer");
var notificationService = require("../helpers/NotificationService");

module.exports={

    all: actionComposer({
        action: function(req, resp){
            User.forge({id: req.session.userId}).load(["branches"]).then(function(user){
                resp.json(user.related("branches").toJSON({omitPivot: true}));
            });
        }
    }),

    get: actionComposer({
       beforeFilters: [mandatoryParamFilter(["id"])],
        action: function(req, resp) {
            User.forge({id: req.session.userId}).branch(req.query.id).fetch().then(function (m) {
                resp.json(m);
            });
        }
    }),

    getShareInformation: actionComposer({
        beforeFilters: [mandatoryParamFilter(["id"])],
        action: function(req, resp) {
            logger.debug("get share info started " + req.params);
            Branch.forge({id: req.query.id}).getShareInformation().then(function(data) {
                logger.info("share data for branch: " + req.query.id + " data:" + JSON.stringify(data));
                data.owners.splice(_.findIndex(data.owners, function(owner){return owner.id === req.session.userId}),1);
                resp.json(data);
            });
        }
    }),

    //todo: notification is send even if branch share failed
    share: actionComposer({
        beforeFilters: [mandatoryParamFilter(["id"]),
                        ensureBranchExist("id"),
                        validateBranchOwnership],
        action: function(req,resp){
            logger.info("save share branch action started " + req.body);
            var promises =[];

            var branch = Branch.forge({id: req.body.id});
            branch.set({is_public: req.body.isPublic});

            req.body.owners.forEach(function (userId) {
                promises.push(BranchRight.forge({branch_id: req.body.id, user_id: userId}).saveBasedOnParams({owner: true}).then(function (isSaved) {
                    if(isSaved) {
                        promises.push(notificationService.branchShareNotification([req.body.id, req.session.userId], userId));
                    }
                    return isSaved;
                }));
            });

            req.body.observers.forEach(function (userId) {
                promises.push(BranchRight.forge({branch_id: req.body.id, user_id: userId}).saveBasedOnParams({owner: false}).then(function (isSaved) {
                    if(isSaved){
                        promises.push(notificationService.branchShareNotification([req.body.id, req.session.userId], userId));
                    }
                    return isSaved;
                }));
            });

            promises.push(branch.save());

            Promise.all(promises).then(function(){
                resp.status(200).send("Information about sharing was saved");
            });
        }
    }),

    post: actionComposer({
        beforeFilters: [mandatoryParamFilter(["branch"])],
        action: function(req,resp){
            (function(){
                if(req.body.branch.id){
                return Branch.forge(req.body.branch).save()
            } else {
                return User.forge({id : req.session.userId}).related("branches").create(Branch.forge(req.body.branch));
            }})().then(function(){
                resp.sendStatus(200);
            })
        }
    }),

    remove: actionComposer({
        beforeFilters: [mandatoryParamFilter(["id"])],
        action: function(req, resp){
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
    })

}