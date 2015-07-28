var bookshelf = require ('../../config/db/bookshelf');

var branch = bookshelf.Model.extend({
    tableName: "branches",

    parent: function(){
        return this.belongsTo("Branch");
    },
    bookmarks: function() {
        return this.hashMany("Bookmark");
    },
    users: function(){
        return this.belongsToMany("User");
    }
});

bookshelf.model("Branch", branch);