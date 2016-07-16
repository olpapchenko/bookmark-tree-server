var path = require("path"),
    fs = require("fs"),
    googleTokenVerifier = require('google-id-token-verifier'),

    User      = require("../models/user"),
    appConfig = require("../../config/app_config"),
    actionComposer = require("./actionComposer"),
    Branch = require("../models/Branch"),
    Bookshelf = require ('../../config/db/bookshelf'),
    mandatoryParamFilter = require("../filters/mandatoryParamFilter");
    validateNotAuthorizedFilter  = require("../filters/validateNotAuthorizedFilter");

module.exports.get = actionComposer({action: function (req, resp) {
     return User.forge({id: req.params.id}).loadUser().then(function(user) {
        if(!user) {
            return user;
        }
        return User.forge({id: req.session.userId}).isFriend(user);
    }).then(function (user) {
        resp.json(user);
    });
}})

module.exports.byName = actionComposer({action:function(req, resp){
    return User.byName(req.params.name).then(function(users){
       return User.forge({id: req.session.userId}).isFriend(users);
    }).then(function(users) {
         return resp.json(users);
    });
}})

module.exports.checkMailAvailability = actionComposer({action:function (req, resp) {
    return User.forge({mail: req.query.mail}).fetch().then(function (user) {
        if(user) {
            resp.json({available: false});
        } else {
            resp.json({available: true});
        }
    })
}})

module.exports.current = actionComposer({action:function(req,resp){
    return new User({id: req.session.userId}).fetch()
        .then(function(model){
            if(model) {
                resp.json(model.omit("password"));
            }else {
                resp.sendStatus(400);
            }
    });
}})

module.exports.put = actionComposer({
    beforeFilters: [mandatoryParamFilter(["name", "about"])],
    action: function (req, resp) {
        return User.forge({id: req.session.userId}).fetch().then(function (user) {
            if(req.body.avatar) {
                if(user.get('avatar') && path.extname(user.get('avatar')).toLowerCase() != path.extname(req.body.avatar).toLowerCase()){
                    fs.unlink(path.join(appConfig.avatarDir, user.get('avatar')));
                }
                user.set({avatar: req.body.avatar});
            }
            user.set({ name :req.body.name, about: req.body.about});
            return user.save();
        }).then(function () {
            resp.sendStatus(200);
        });
    }
});

module.exports.login = actionComposer({beforeFilters: [mandatoryParamFilter(["mail", "password"]), validateNotAuthorizedFilter], action:function (req, resp) {
    return User.login(req.body.mail, req.body.password).then(function (user) {
        if (user) {
            req.session.userId = user.id;
            resp.json(user);
        } else {
            resp.status(400).send("mail/password is incorrect");
        }
    });
}});

module.exports.loginByGoogle = actionComposer({beforeFilters: [validateNotAuthorizedFilter, mandatoryParamFilter(["id_token"])],  action: function (req, resp) {

        googleTokenVerifier.verify(req.body.id_token, appConfig.auth.google.clientId, function (err, tokenInfo) {
            if(!err) {
                 User.forge({mail: tokenInfo.email}).fetch().then(function (user) {
                    if(user) {
                        req.session.userId = user.id;
                        resp.json(user);
                    } else {
                        return User.register({origin: User.origin.google, mail: tokenInfo.email, name: tokenInfo.name, avatar: tokenInfo.picture})
                            .tap(function (user) {
                                return  Bookshelf.model("Branch").createBranch({name: "Default Branch", default: true}, user.id);
                            }).then(function (user) {
                                req.session.userId = user.id;
                                resp.json(user);
                            });
                    }
                });
            } else {
                resp.status(400).send("authentification is not passed");
            }
        });
}});

module.exports.post = actionComposer({
    beforeFilters: [mandatoryParamFilter(["name", "mail", "password"])],
    action: function (req,resp) {
        return User.register(req.body)
        .then(function (user) {
           return  Bookshelf.model("Branch").createBranch({name: "Default Branch", default: true}, user.id);
        })
        .then(function(model) {
            module.exports.login(req, resp);
        });
    }
});

module.exports.logout = function(req, resp) {
    req.session.destroy();
    resp.sendStatus(200);
}


