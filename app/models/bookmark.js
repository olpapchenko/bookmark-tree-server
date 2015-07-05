var bookshelf = require ('../../config/db/bookshelf');

var Comment = require('./comment');
var User = require('./user');
var Marker = require('./marker');
var Rights = require('./rights');

module.exports  = bookshelf.Model.extend({
    tableName: "bookmarks",

    comments: function () {
        return this.hasMany(Comment);
    },

    markers: function () {
        return this.hasMany(Marker);
    },

    users: function () {
        return this.belongsToMany(User);
    },

    rights: function ( ) {
        return this.hasMany(Rights);
    }

}, {
    getById: function (id, userId) {
        this.where({id: id}).fetch({withRelated: ["users","rights"]})
            .then(function (model) {
                if(model.related("users").find(function (model){return model.id == userId}) &&
                    (model.related("rights").find(function (model){return model.read || model.write} ||
                    !model.related("rights")))) {
                    return model;
                } else {
                    return null;
                }
        });
    },
    getAllById: function(id, userId) {
        this.where({id: id}).query({}).fetchAll({withRelated: ["rights", "users"]}).then(function(bookmarks){
            //bookmarks.filter(function (model) {
            //    return model.related("rights").read || model.related("rights").write
            //           && model.related("users").filter(function (user) {});
            //});
        });

    }
});