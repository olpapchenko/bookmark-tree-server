var bookshelf = require ('../../config/db/bookshelf'),
    AbstractModel = require("./AbstractModel");

var preferences = AbstractModel.extend({
    tableName: 'preferences',

    user: function () {
        this.belongsTo("User");
    }
});

module.exports = bookshelf.model("Preference", preferences);