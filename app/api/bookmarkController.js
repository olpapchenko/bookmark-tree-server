var bookmark = require("../models/bookmark");
var user = require("../models/user");

module.all = function (req, resp) {
    new user({id: req.session.userId}).fetch({
        withRelated: ['bookmarks']
    }).then(function (user) {
        resp.json(user.related('bookmarks'));
    });
}

module.exports.get = function (req, resp) {
    bookmark.where({id: req.params.id}).fetch({
        withRelated: ['users']
    }).then(function (b) {
        if(b.related('users').filter(function (c) {return c.id == res.session.userId})){
            resp.json(b);
        } else {
            resp.json({});
        }
    });
}

module.exports.put = function (req, resp) {

}

module.exports.post = function (req, resp){
    if(req.body.name && req.body.url){
        new bookmark(req.body).save().then(
            function (model) {
                resp.json(model);
            },
            function () {
                resp.status(500).send("Internal server error contact your administrator");
            }
        );
    } else {
        resp.status(400).send("name and url can not be empty");
    }
}