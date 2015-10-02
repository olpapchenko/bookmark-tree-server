var BookmarkRights = require("../models/bookmarkRights");
var FilterError = require("./FilterError");

module.exports = function (req) {
    return BookmarkRights.forge({bookmark_id: req.body.id, user_id: req.session.userId}).fetch().then(function (right) {
        if(!right.get("owner")) {
            throw new FilterError("Action denied user with id " + req.session.userId + " is not owner of the bookmark with id " + req.body.id);
        }
    })
}
