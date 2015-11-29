var _ = require("underscore");
var FilterError = require("./FilterError");

module.exports = function(args) {
     return function(req) {
         var queryStorages = [req.body, req.params, req.query];
         var keys = [];
         queryStorages.forEach(function(storage){
             keys.push(_.keys(storage));
         });
         args.forEach(function(arg) {
             if (!(_.flatten(keys).indexOf(arg) > -1)) {
                throw new FilterError("request dost not contain " + arg);
             }
         })
    }
}
