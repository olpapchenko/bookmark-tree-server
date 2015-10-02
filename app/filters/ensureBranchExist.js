var Branch = require("../models/branch");
var FilterError = require("./FilterError");

module.exports = function(req){
    return Branch.forge({id: req.body.id}).fetch().then(function(model){
        if(model == null) {
            throw new FilterError("Branch with id " + req.body.id + " does not exist!");
        }
        req.branch = model;
        return model;
    });
}