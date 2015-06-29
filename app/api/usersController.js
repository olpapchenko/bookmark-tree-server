var User = require("../models/user");

module.exports.get = function (req, resp) {
    new User({id: req.params.id}).fetch().then(function(model) {
        resp.json(model.omit("password"));
    });
}

module.exports.current = function(req,resp){
    if(req.session.userId) {
        new User({id: req.session.userId}).fetch().then(function(model){
            if(model) {
                resp.json(model);
            }else {
                resp.sendStatus(400);
            }
        });
    } else {
        resp.sendStatus(400);
    }
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
    if(req.body.name && req.body.password){
        User.register(req.body).then(function(model) {
            resp.json(model);
        });
    } else {
        resp.sendStatus(400);
    }
}

module.exports.login= function (req, resp) {
    if(req.body.mail && req.body.password && !req.session.userId){
        User.login(req.body.mail, req.body.password).then(function (user) {
            if (user) {
                req.session.userId = user.id;
                resp.json(user);
            } else {
                resp.sendStatus(403);
            }
        });
    } else {
        resp.sendStatus(403);
    }
}

module.exports.logout = function(req, resp) {
    if (req.session) {
        req.session.destroy();
        resp.sendStatus(200);
    } else resp.statusCode(400)
}


