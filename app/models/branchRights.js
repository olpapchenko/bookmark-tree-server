var Promise = require("bluebird");

var Bookshelf = require ('../../config/db/bookshelf');
var AbstractModel = require("./abstractModel");
var AbstractRight = require("./abstractRight");

var Branch = require("./branch");

var JOIN_COLUMN = "branch_id";

var branchRights = Bookshelf.model('AbstractModel').extend(null, AbstractRight).extend({

    tableName: "branch_rights",

    users: function () {
        return this.belongsTo("User");
    },

    branches: function() {
        return this.belongsTo("Branch");
    }
}, {
    updateBranchRights: function(rights, saveCallBack) {
        console.log(Branch.forge);
        return this.updateRights(rights, Bookshelf.model("Branch"), JOIN_COLUMN, saveCallBack);
    }
});

module.exports = Bookshelf.model("Branch_rights", branchRights);