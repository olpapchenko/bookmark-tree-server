var BranchRights = require("../models/branchRights");

module.exports = function (req) {
    return BranchRights.forge({branch_id: req.body.id, user_id: req.session.userId}).fetch().then(function (right) {
        console.log(right);

        if(!right.get("owner")) {
            throw new Error("Action denied user with id " + req.session.userId + " is not owner of the branch with id " + req.body.id);
        }
    })
}