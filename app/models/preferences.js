var bookshelf = require ('../../config/db/bookshelf'),
    AbstractModel = require("./AbstractModel");

var preferences = AbstractModel.extend({
    user: function () {
        this.belongsTo("User");
    }
});

module.exports = bookshelf.model("Preference", preferences);