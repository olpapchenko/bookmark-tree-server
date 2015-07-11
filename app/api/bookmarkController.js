var bookmark = require("../models/bookmark");
var user = require("../models/user");

module.all = function (req, resp) {
    bookmark.getByUserId(req.session.userId).then(function(bookmarks){
        resp.json(bookmarks);
    });
}

module.exports.get = function (req, resp) {
    bookmark.getById(req.session.userId, req.params.id).then(function(bookmark){
        resp.json(bookmark);
    });
}

module.exports.put = function (req, resp) {
    bookmark.update(req.body.bookmark, req.session.userId).then(function(res){
        if(res) {
            resp.sendStatus(200);
        }else {
            resp.status(403).send("You have no right to edit this bookmark");
        }
    }, function(){
        resp.status(200).send("can not update bookmark, please contact your administrator");
    });
}

module.exports.post = function (req, resp){
    bookmark.create(req.body.bookmark, req.session.userId).then(function(){
        resp.sendStatus(200);
    }, function(){
        resp.status(200).send("can not create bookmark, please contact your administrator");
    });
}