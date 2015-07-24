var bookshelf = require ('../../config/db/bookshelf');

var notification = Bookshelf.Model.extend({
    tableName: "notifications",
    user: function() {
        return this.belongsTo("User");
    }
});

bookshelf.model("Notification", notification);