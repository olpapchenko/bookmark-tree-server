var User = require("../models/user");

module.exports.get = function (req, resp) {
    new User({id: req.params.id}).fetch().then(function(model) {
        resp.json({userName: model.userName, about: model.about, avatar: model.avatar});
    });
}

module.exports.put = function (req, resp) {
    if(req.body.id && req.body.id == resp.session.userId) {
        new User({id: req.id}).fetch(function (model) {
            model.name = req.body.name;
            model.about = req.body.about;
            return model.save();
        }).then(function () {
            resp.sendStatus(200);
        });
    } else {
        resp.sendStatus(400);
    }
    resp.end();
}

module.exports.post = function (req,resp) {
    if(req.body.userName && req.body.password){
        User.register(req.body.user).then(function (user){
            resp.json(user);
        });
    } else {
        resp.sendStatus(400);
        resp.end();
    }
}

module.exports.login= function (req, resp) {
    if(req.body.userName && req.body.password){
        User.login(req.body.userName, req.body.password).then(function (user) {
            if (user) {
                resp.session.userId = user.id;
                resp.json(user);
            } else {
                resp.statusCode(403);
                resp.end();
            }
        });
    }
}

module.exports.logout = function(req, resp) {
    if (resp.session) {
        resp.destroy();
        resp.statusCode(200);
    } else resp.statusCode(400)
    resp.end();
}


