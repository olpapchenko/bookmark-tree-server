var Promise = require('bluebird');

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
                options.action(req, resp)
            })
            .catch(function(e) {
                resp.status(400).send(e.message);
            });
    }
}
