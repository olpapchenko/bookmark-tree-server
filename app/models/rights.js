var bookshelf = require ('../../config/db/bookshelf');

var User = require('./user');
var Bookmark = require('./bookmark');

var right  = bookshelf.Model.extend({
    tableName: "rights",

    user: function  () {
        return this.belongsTo("User");
    },

    bookmark: function () {
        return this.belongsTo("Bookmark");
    }
});

module.exports = bookshelf.model("right", right);