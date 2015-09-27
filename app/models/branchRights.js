var Bookshelf = require ('../../config/db/bookshelf');

var AbstractModel = require("./abstractModel");

var branchRights = Bookshelf.model('AbstractModel').extend({

    tableName: "branch_rights",

    users: function () {
        return this.belongsTo("User");
    },

    branches: function() {
        return this.belongsTo("Branch");
    }
});

module.exports = Bookshelf.model("Branch_rights", branchRights);