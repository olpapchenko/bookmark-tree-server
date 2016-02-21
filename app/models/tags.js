var bookshelf = require ('../../config/db/bookshelf');

var AbstractModel = require('./AbstractModel');
var Bookmark = require("./bookmark");
var User = require("./user");

tags = AbstractModel.extend({
    tableName: "tags",

    bookmarks: function () {
        return this.belongsToMany("Bookmark");
    },

    users: function () {
        return this.hasMany("User");
    }
});

module.exports = bookshelf.model("Tag", tags);