var bookmark = require("../models/bookmark");
var user = require("../models/user");

module.all = function (req, resp) {
    bookmark.getByUserId(req.session.userId).then(function(bookmarks){
        resp.json(bookmarks);
    });
}

module.exports.get = function (req, resp) {
    bookmark.getById(req.session.userId, req.params.id).then(function(bookmark){
        if(!bookmark){
            resp.status(404).send("bookmark not found");
            return;
        }
        resp.json(bookmark);
    });
}

module.exports.post = function (req, resp) {
    bookmark.persist(req.body.bookmark, req.session.userId).then(function(res){
        if(res) {
            resp.sendStatus(200);
        }else {
            resp.status(403).send("You have no right to edit this bookmark");
        }
    }, function(){
        resp.status(500).send("can not update bookmark, please contact your administrator");
    });
}