var bookshelf = require ('../../config/db/bookshelf');

var Bookmark = require('bookmark');
var Rights = require('rights');

module.exports = bookshelf.Model.extend({
    tableName: 'users',

    bookmark: function () {
        return this.hasMany(Bookmark);
    },

    rights: function () {
        return this.hasMany(Rights);
    }
});
