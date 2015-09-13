var Bookshelf = require ('../../config/db/bookshelf');

var branchRights = Bookshelf.Model.extend({

    tableName: "branch_rights",

    users: function () {
        return this.belongsTo("User");
    },

    branches: function() {
        return this.belongsTo("Branch");
    }
});

module.exports = Bookshelf.model("Branch_rights", branchRights);