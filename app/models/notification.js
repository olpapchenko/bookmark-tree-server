var Bookshelf = require ('../../config/db/bookshelf');

var notification = Bookshelf.Model.extend({
    tableName: "notifications",
    user: function() {
        return this.belongsTo("User");
    }
});

module.exports = Bookshelf.model("Notification", notification);