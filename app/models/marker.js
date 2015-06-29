var bookshelf = require ('../../config/db/bookshelf');

var Bookmark = require('./bookmark');

module.exports  = bookshelf.Model.extend({
    tableName: "markers",

    bookmark: function () {
        return this.belongsTo(Bookmark);
    }

});
