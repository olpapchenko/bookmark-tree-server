var BookmarkRights = require("../models/bookmarkRights");

module.exports = function (req) {
    return BookmarkRights.forge({bookmark_id: req.body.id, user_id: req.session.userId}).fetch().then(function (right) {
        if(!right.get("owner")) {
            throw new Error("Action denied user with id " + req.session.userId + " is not owner of the branch with id " + req.body.id);
        }
    })
}
