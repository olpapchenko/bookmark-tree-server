var Branch = require("../models/Branch");
var FilterError = require("./FilterError");

module.exports = function(req){
    var id = req.body.id || req.params.id || req.query.id;
    return Branch.forge({id: id}).fetch().then(function(model){
        if(model == null) {
            throw new FilterError("Branch with id " + req.body.id + " does not exist!");
        }
        req.branch = model;
        return model;
    });
}