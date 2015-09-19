var Bookshelf = require ('../../config/db/bookshelf');

var branchRights = Bookshelf.Model.extend({

    tableName: "branch_rights",

    users: function () {
        return this.belongsTo("User");
    },

    branches: function() {
        return this.belongsTo("Branch");
    },
    saveBasedOnParams : function (attrs) {
        return this.fetch().then(function (model) {
            return (model || this).set(attrs).save();
        })
    }
});

module.exports = Bookshelf.model("Branch_rights", branchRights);