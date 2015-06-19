var bookshelf = require ('../../config/db/bookshelf');

var Comment = require('comment');
var User = require('user');
var Marker = require('marker');

module.exports  = bookshelf.Model.extend({
    tableName: "bookmark",

    comments: function () {
        return this.hasMany(Comment);
    },

    markers: function () {
        return this.hasMany(Marker);
    },

    owners: function () {
        return this.belongsToMany(User);
    }

});