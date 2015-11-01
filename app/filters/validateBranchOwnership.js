var BranchRights = require("../models/branchRights");
var ensureBranchExist = require("./ensureBranchExist");
var FilterError = require("./FilterError");

module.exports = function (req) {
    var id = req.body.id || req.params.id || req.query.id;

    return ensureBranchExist(req).then(function () {

        return BranchRights.forge({branch_id: id, user_id: req.session.userId}).fetch().then(function (right) {
            if(!right) {
                throw new FilterError("Action denied user with id " + req.session.userId + " is not owner of the branch with id " + req.body.id);
            }
        })
    }, function (e) {
        if (e.type && e.type == "FilterError") {
            return "OK";
        }
    });

}