var notifications = require("../models/notification");

module.exports = {
    get: function(req, resp){
         notifications.forge({user_id: req.session.userId}).fetchAll().then(function(model){
             resp.json(req.params.count ? model.first(req.para.s.count) : model);
         });
    },
    read : function(req, resp){
        notifications.forge(req.body.id).destroy().then(function(){
            resp.sendStatus(200);
        });
    }
}