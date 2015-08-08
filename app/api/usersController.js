var User = require("../models/user");

module.exports.get = function (req, resp) {
    new User({id: req.params.id}).fetch().then(function(model) {
        resp.json(model.omit("password"));
    });
}

module.exports.byName = function(req, resp){
    User.byName(req.params.name).then(function(users){
        resp.json(users);
    })
}

module.exports.current = function(req,resp){
    new User({id: req.session.userId}).fetch().then(function(model){
        if(model) {
            resp.json(model.omit("password"));
        }else {
            resp.sendStatus(400);
        }
    });
}

//todo implement avatar change
module.exports.put = function (req, resp) {
    new User({id: req.session.userId}).fetch().then(
        function (model) {
            model.set({ name :req.body.name, about: req.body.about});
            return model.save();
        }
    ).then(function () {
        resp.sendStatus(200);
    });
}

module.exports.post = function (req,resp) {
    if(req.body.mail && req.body.password){
        User.register(req.body).then(function(model) {
            resp.json(model);
        }, function (model) {
            if(model.code == 23505){
                resp.status(400).send("user with this mail already exists");
            } else {
                resp.status(500).send("Internal server error, please contact administrator");
            }
        });
    } else {
        resp.status(400).send("mail or username missing");
    }
}

module.exports.login= function (req, resp) {
    if(req.session.userId) {
        resp.status(400).send("you are already logged in");
    }
    else if(req.body.mail && req.body.password){
        User.login(req.body.mail, req.body.password).then(function (user) {
            if (user) {
                req.session.userId = user.id;
                resp.json(user);
            } else {
                resp.status(400).send("mail/password is incorrect");
            }
        });
    } else {
        resp.status(403).send("you have not specified password/mail");
    }
}

module.exports.logout = function(req, resp) {
    req.session.destroy();
    resp.sendStatus(200);
}


