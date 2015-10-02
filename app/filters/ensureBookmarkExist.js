var Bookmark = require("../models/bookmark");
var FilterError = require("./FilterError");

module.exports = function(req){
    return Bookmark.forge({id: req.body.id}).fetch().then(function(model){
        if(model == null) {
            throw new FilterError("Bookmark with id " + req.body.id + " does not exist!");
        }
        req.bookmark = model;
        return model;
    });
}