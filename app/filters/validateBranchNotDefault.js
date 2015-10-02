var Branch = require("../models/Branch");
var FilterError = require("./FilterError");

module.exports = function (req) {
    return Branch.forge({id: req.body.id}).fetch().then(function (model) {
        if(model.default) {
            throw new FilterError("You can not perform action for default branch");
        }
    });
}