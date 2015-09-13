var Bookshelf = require ('../../config/db/bookshelf');
var User = require('./user');
var Bookmark = require('./bookmark');
var BranchRights = require("./branchRights");
var Promise = require("bluebird");
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
    shareSecure: function(owner, user_id, ownership){
        return  this.user(owner).fetch().then(function(owner){
                console.log("owner " + owner.isEmpty());
                    if(!owner.isEmpty()){
                        return Promise.all([this.attach(Bookshelf.model("User").forge({id: user_id}))]);
                    } else{
                         return Promise.reject("You are not eligible to share this branch!");
                    }
                }).then(function(){
                    return "Branch was successfully shared";
                }, function(m){
                    console.log("message " + m);
                    var message = m.message || m;
                    if(message.indexOf("повторяющееся значение ключа") > -1){
                        return "Branch is already shared";
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
                console.log("shared brancd " + id.branch_id);
                branchPromises.push(_this.forge({id: id.branch_id}).fetch());
            });
            return Promise.all(branchPromises);
        });
    }
});

module.exports = Bookshelf.model("Branch", branch);