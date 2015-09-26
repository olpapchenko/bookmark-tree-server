module.exports = function(options){
    return function(req, resp) {
        var error
        options.beforeFilters.forEach(function(filter){
            try {
                filter(req, resp);
            } catch(e) {
                resp.status(400).send(e.message);
                error = true;
            }});
        if (!error){options.action(req, resp)};
    }
}
