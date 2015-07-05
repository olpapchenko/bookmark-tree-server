var bookshelf = require ('../../config/db/bookshelf');

var Bookmark = require('./bookmark');

var marker = bookshelf.Model.extend({
    tableName: "markers",

    bookmark: function () {
        return this.belongsTo("Bookmark");
    }
});

module.exports = bookshelf.model("Marker", marker);