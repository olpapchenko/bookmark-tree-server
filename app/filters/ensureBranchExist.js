var Branch = require("../models/branch");

module.exports = function(id) {
    return function(req){
        return Branch.forge({id: req.body.id}).fetch().then(function(model){
            if(model == null) {
                throw new Error("Branch with id " + req.body.id + " does not exist!");
            }
            req.branch = model;
            return model;
        });
    }
}