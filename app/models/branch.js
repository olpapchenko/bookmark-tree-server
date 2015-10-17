var _ = require("underscore");
var Promise = require("bluebird");

var Bookshelf = require ('../../config/db/bookshelf');
var User = require('./user');
var Bookmark = require('./bookmark');
var AbstractModel = require("./abstractModel");
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
    obserwers: function() {
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
        return Promise.all([this.owners().fetch({columns: ["users.id", "users.name"]}), this.obserwers().fetch({columns: ["users.id", "users.name"]})])
            .then(function(res){
            logger.debug("share results for branch: " + this.id + " res " + res);
            return {owners: res[0].models, observers: res[1].models}
        });
    },
    shareSecure: function(owner, user_id, ownership){
         var _this = this;
         return _this.checkOwnerhip(owner)
        .then(function(){
                return _this.addRight(user_id, ownership);
            }, function(){
                Promise.reject("You are not eligible to share this branch!");
            })
        .then(function(){
                logger.info("Branch %d was shared with %d, ownership %s", this.id, user_id, ownership);
                return "Branch was successfully shared";
            }, function(m){
                logger.error("Branch %d was not shared due to error %s", this.id, m.message);
                var message = m.message || m;
                if(message.indexOf("повторяющееся значение ключа") > -1){
                    return Promise.reject("Branch is already shared");
                } else {
                    return Promise.reject(message);
                }
            });
    },
    unshareSecure: function(owner,user_id){
        return this.user(owner).fetch().then(function(m){
            if(!m.isEmpty()){
                return this.detach(Bookshelf.model("User").forge({id: user_id}));
            } else {
                return Promise.reject("You are not eligible to unshare this branch!");
            }
        }).then(function(){
            return "Branch was successfully unshared";
        }, function(m){
            var message = m.message || m;
            if(message.indexOf("EmptyResponse") > -1){
                return "You can not unshare not shared branch";
            } else
            return message;
        })
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
                return BranchRights.attachBranchRight(branch, userId);
            })
    },

    getShared: function(userId, coOwner) {
        var _this = this;
        return  Bookshelf.knex.raw("select distinct(branch_id) from branch_rights where user_id = " + coOwner + " and branch_id in (select branch_id from branch_rights where owner = true and user_id =" + userId + ")")
            .then(function(res) {
                return res.rows;
            })
            .map(function (row) {
                return _this.fetchById(row.branch_id);
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