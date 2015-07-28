var bookshelf = require ('../../config/db/bookshelf');

var branch = bookshelf.Model.extend({
    tableName: "branches",

    parent: function(){
        return this.belongsTo("Branch");
    },
    bookmarks: function() {
        return this.hasMany("Bookmark");
    },
    users: function(){
        return this.belongsToMany("User");
    }
});

module.exports = bookshelf.model("Branch", branch);