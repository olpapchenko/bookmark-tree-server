module.exports = function(params) {
    return function(req, resp) {
        params.forEach(function(param) {
            if((req.params && req.params.indexOf(param)) > -1 || (req.body && req.body.indexOf(param) > -1)){
                throw new Error("parameter " + param + " is not specified");
            }
        });
    }
}