var Bookshelf = require ('../../config/db/bookshelf');
var Promise = require("bluebird");

var AbstractModel = require("./AbstractModel");
var AbstractRight = require("./AbstractRight");
var User = require('./user');
var Bookmark = require('./Bookmark');

var JOIN_COLUMN = "bookmark_id";

var right  = AbstractRight.extend({
    tableName: "bookmark_rights",

    user: function  () {
        return this.belongsTo("User");
    },

    bookmark: function () {
        return this.belongsTo("Bookmark");
    }
}, {
    updateBookmarkRight: function (rights, saveCallback) {
        return this.updateRights(rights, Bookshelf.model("Bookmark"), JOIN_COLUMN, saveCallback);
    },

    attachBookmarkRight: function (model, userId) {
        return this.attachOwnershipInfo(model, JOIN_COLUMN, userId);
    },

    attachBookmarkRights: function (models, userId) {
        return this.attachOwnershipInfos(models, JOIN_COLUMN, userId);
    }
});

module.exports = Bookshelf.model("Bookmark_rights", right);
