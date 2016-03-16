var bookshelf = require ('../../config/db/bookshelf');
var AbstractModel = require('./AbstractModel');
var Bookmark = require("./Bookmark");

links = AbstractModel.extend({
    tableName: "links",

    bookmarks: function () {
        return this.belongsTo("Bookmark");
    }
});

module.exports = bookshelf.model("Link", links);
