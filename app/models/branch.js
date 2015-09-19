var Bookshelf = require ('../../config/db/bookshelf');
var User = require('./user');
var Bookmark = require('./bookmark');
var BranchRights = require("./branchRights");
var Promise = require("bluebird");
var _ = require("underscore");
var logger = require("../utils/log/modelLog");

var branch = Bookshelf.Model.extend({
    tableName: "branches",

    parent: function(){
        return this.belongsTo("Branch");
    },
    bookmarks: function() {
        return this.hasMany("Bookmark");
    },
    users: function(){
        return this.belongsToMany("User").through("Branch_rights");
    },
    user: function(user_id){
        return this.users().query({where: {user_id: user_id}});
    },
    rights: function(){
        return this.hasMany("Branch_rights");
    },
    saveBasedOnParams : function (attrs) {
        return this.fetch().then(function (model) {
            return model.set(attrs).save();
        })
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
    getShared: function(userId, coOwner) {
        var _this = this;
        return  Bookshelf.knex.raw("select distinct(branch_id) from branch_rights where user_id = " + coOwner + " and branch_id in (select branch_id from branch_rights where owner = true and user_id =" + userId + ")").then(function(res) {
            var branchPromises = []
            res.rows.forEach(function(id){
                branchPromises.push(_this.forge({id: id.branch_id}).fetch());
            });
            return Promise.all(branchPromises);
        });
    }
});

module.exports = Bookshelf.model("Branch", branch);