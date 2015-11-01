var Promise = require("bluebird");

var Bookshelf = require ('../../config/db/bookshelf');
var AbstractModel = require("./abstractModel");
var AbstractRight = require("./abstractRight");

var Branch = require("./branch");

var JOIN_COLUMN = "branch_id";

var branchRights = AbstractRight.extend({

    tableName: "branch_rights",

    users: function () {
        return this.belongsTo("User");
    },

    branches: function() {
        return this.belongsTo("Branch");
    }
}, {
    updateBranchRights: function(rights, saveCallBack) {
        return this.updateRights(rights, Bookshelf.model("Branch"), JOIN_COLUMN, saveCallBack);
    },

    attachBranchRight: function (model) {
        return this.attachOwnershipInfo(model, JOIN_COLUMN);
    },

    attachBranchesRights: function (models) {
        return this.attachOwnershipInfos(models, JOIN_COLUMN);
    }
});

module.exports = Bookshelf.model("Branch_rights", branchRights);