var bookshelf = require ('../../config/db/bookshelf');

var Comment = require('./comment');
var User = require('./user');
var Marker = require('./marker');
var Rights = require('./rights');

module.exports  = bookshelf.Model.extend({
    tableName: "bookmark",

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

});