var BranchRights = require("../models/branchRights");
var ensureBranchExist = require("./ensureBranchExist");
var FilterError = require("./FilterError");

module.exports = function (req) {

    return ensureBranchExist(req).then(function () {
        return BranchRights.forge({branch_id: req.body.id, user_id: req.session.userId}).fetch().then(function (right) {
            if(!right || !right.get("owner")) {
                throw new FilterError("Action denied user with id " + req.session.userId + " is not owner of the branch with id " + req.body.id);
            }
        })
    }, function (e) {
        if (e.type && e.type == "FilterError") {
            return "OK";
        }
    });

}