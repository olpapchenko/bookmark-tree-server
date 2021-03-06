var Promise = require('bluebird');
var logger = require("../utils/log/cntrlLog");
var FilterError = require("../filters/FilterError");

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
                return options.action(req, resp);
            }, function(e) {
                if(e.type && e.type == "FilterError"){
                    resp.status(400).send(e.message);
                } else {
                    return Promise.reject(e);
                }
            }).catch(function (e) {
                logger.error(e);
                resp.status(500).send("Something went wrong, please report the problem");
            });
    }
}
