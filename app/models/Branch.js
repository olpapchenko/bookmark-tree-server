var _ = require("underscore");
var Promise = require("bluebird");

var Bookshelf = require ('../../config/db/bookshelf');
var User = require('./user');
var Bookmark = require('./Bookmark');
var AbstractModel = require("./AbstractModel");
var BranchRights = require("./branchRights");

var logger = require("../utils/log/modelLog");

var branch = AbstractModel.extend({
    tableName: "branches",

    parent: function(){
        return this.belongsTo("Branch");
    },
    bookmarks: function() {
        return this.belongsToMany("Bookmark");
    },
    users: function(){
        return this.belongsToMany("User").through("Branch_rights");
    },
    user: function(user_id){
        return this.users().query({where: {user_id: user_id}});
    },
    observers: function() {
        return this.users().query(function(qb){
            qb.whereRaw("(owner is null or owner = false)");
        })
    },
    owners: function(){
        return this.users().query({where: {owner: true}});
    },
    rights: function(){
        return this.hasMany("Branch_rights");
    },
    checkOwnerhip: function(user_id) {
        var _this = this;
        return BranchRights.forge({branch_id: _this.id, user_id: user_id}).fetch()
            .then(function(right){
                return right.get("owner") || Promise.reject();
            });
    },
    addRight: function (user_id, ownership){
        return BranchRights.forge({user_id: user_id, branch_id: this.id}).saveBasedOnParams({owner: ownership});
    },
    getShareInformation: function() {
        return Promise.all([this.owners().fetch({columns: ["users.id", "users.name"]}), this.observers().fetch({columns: ["users.id", "users.name"]})])
            .then(function(res){
                logger.debug("share results for branch: " + this.id + " res " + res);
                return {owners: res[0].models, observers: res[1].models}
            });
    },

    remove: function () {
        return this.fetch().then(function(model){
            if(model.default){
                throw "defaultBranch";
            } else{
                return model.load("users");
            }
        })
            .tap(function(model) {
                model.destroy();
            });
    }
},{
    fetchById: function (id, userId){
        return this.forge({id: id}).fetch()
            .then(function (branch) {
                return BranchRights.attachBranchRight(branch);
            })
    },

    getShared: function(userId, coOwner) {
        var _this = this;
        return  Bookshelf.knex.raw("select distinct(branch_id) from branch_rights where user_id = " + coOwner +
        " and branch_id in (select branch_id from branch_rights where user_id =" + userId + ")")
            .then(function(res) {
                return res.rows;
            })
            .map(function (row) {
                return _this.fetchById(row.branch_id, coOwner);
            });
    },

    createBranch: function (attrs, owner) {
        var _this = this;
        return Bookshelf.transaction(function (t) {
            return _this.forge(attrs).save(null,{transacting: t}).then(function (branch) {
                return BranchRights.forge({user_id: owner, branch_id: branch.id}).save({owner: true}, {transacting: t});
            });
        })
    }
});

module.exports = Bookshelf.model("Branch", branch);