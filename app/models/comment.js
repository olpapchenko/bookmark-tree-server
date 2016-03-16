var bookshelf = require ('../../config/db/bookshelf');

var Bookmark = require("./Bookmark");

var commnet = bookshelf.Model.extend({
    tableName: "comments",

    bookmark: function () {
        return this.belongsTo("Bookmark");
    }
});

module.exports = bookshelf.model("Comment", commnet);