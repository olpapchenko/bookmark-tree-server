module.exports = function(options){
    return function(req, resp) {
        for(var beforeFilter in options.beforeFilters) {
            try {
                beforeFilter(req, resp);
            } catch(e) {
                resp.status(400).send(e.message);
            }
        }
        options.action(req, resp);
    }
}