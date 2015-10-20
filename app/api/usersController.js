var User      = require("../models/user"),
    appConfig = require("../../config/app_config"),
    path = require("path"),
    fs = require("fs");

module.exports.get = function (req, resp) {
    new User({id: req.params.id}).fetch().then(function(model) {
        resp.json(model.omit("password"));
    });
}

module.exports.byName = function(req, resp){
    User.byName(req.params.name).then(function(users){
       return User.forge({id: req.session.userId}).isFrineds(users);
    }).then(function(users) {
         return resp.json(users);
    });
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

module.exports.put = function (req, resp) {
    User.forge({id: req.body.id}).fetch().then(function (user) {
        if(req.body.avatar) {
            if(user.get('avatar') && path.extname(user.get('avatar')) != path.extname(req.body.avatar)){
                fs.unlinkSync(path.join(appConfig.avatarDir, user.get('avatar')));
            }
            user.set({avatar: req.body.avatar});
        }
        user.set({ name :req.body.name, about: req.body.about});
        return user.save();
    }).then(function () {
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
        });r
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


