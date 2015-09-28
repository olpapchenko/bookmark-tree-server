var Promise = require('bluebird');
var logger = require("../utils/log/cntrlLog");

var executeFilter = function(req, filter) {
    try{
        return filter(req);
    } catch(e) {
        return Promise.reject(e);
    }
}

module.exports = function(options){
    return function(req, resp) {
        var promises = [];
        options.beforeFilters = options.beforeFilters ||[];

        options.beforeFilters.forEach(function(filter) {
            promises.push(executeFilter(req, filter));
        });

        Promise.all(promises)
            .then(function () {
                options.action(req, resp);
            }, function(e) {
                resp.status(400).send(e.message);
            }).catch(function (e) {
                logger.error(e);
                resp.status(500).send("Something went wrong, please report the problem");
            })
    }
}
