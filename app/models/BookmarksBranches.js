var Bookshelf = require("../../config/db/bookshelf");

var AbstractModel = require('./AbstractModel'),
    Bookmark = require('./Bookmark'),
    Branch = require('./Branch');

var BookmarksBranches = AbstractModel.extend({
    tableName: "bookmarks_branches",

    branches: function () {
        return this.hasMany("Branch");
    },

    bookmarks: function () {
        return this.hasMany("Bookmark");
    }

});

module.exports = Bookshelf.model("BookmarksBranches", BookmarksBranches);
