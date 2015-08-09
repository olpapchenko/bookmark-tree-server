var notifications = require("../models/notification");

module.exports = {
    get: function(req, resp){
         notifications.forge({user_id: req.session.userId}).fetchAll().then(function(model){
             resp.json(req.params.count ? model.first(req.para.s.count) : model);
         });
    },
    read : function(req, resp){
        var promise = [];
        user.forge({id: req.session.id}).related("notifications").load().then(function(user){
            user.related("notifications").forEach(function(model){
                promise.push(model.destroy());
            });
        });
        Promise.all(promise).then(function(){resp.sendStatus(200)});
    }
}