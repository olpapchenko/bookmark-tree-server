var BookmarkRights = require("../models/bookmarkRights");
var FilterError = require("./FilterError");

module.exports = function (req) {
    //new branch it s OKay
    if(req.body.id == null) {
        return true;
    }
    return BookmarkRights.forge({bookmark_id: req.body.id, user_id: req.session.userId}).fetch().then(function (right) {
        if(!right.get("owner")) {
            throw new FilterError("User is not owner of bookmark!");
        }
    })
}
