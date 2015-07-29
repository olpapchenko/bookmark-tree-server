var notifications = require("../models/notification");

module.exports = {
    get: function(req, resp){
        console.log("started");
         notifications.forge({user_id: req.session.userId}).fetchAll().then(function(model){
             resp.json(req.params.count ? model.first(req.para.s.count) : model);
         });
    }
}