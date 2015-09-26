var _ = require("underscore");

module.exports = function(args) {
     return function(req, resp) {
         var queryStorages = [req.body, req.params, req.query];
         var keys = [];
         queryStorages.forEach(function(storage){
             keys.push(_.keys(storage));
         });
         args.forEach(function(arg) {
             if (!(_.flatten(keys).indexOf(arg) > -1)) {
                throw new Error("request dost not containss " + arg);
             }
         })
    }
}
