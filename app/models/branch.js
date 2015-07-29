var Bookshelf = require ('../../config/db/bookshelf');
var User = require('./user');
var Bookmark = require('./bookmark');
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
        return this.belongsToMany("User");
    },
    user: function(user_id){
        return this.belongsToMany("User").query({where: {id: user_id}});
    },
    shareSecure: function(owner, user_id){
        return  this.user(owner).fetch().then(function(m){
                    if(!m.isEmpty()){
                        return this.attach(Bookshelf.model("User").forge({id: user_id}))
                    } else{
                        return Promise.reject("You are not eligible to share this branch!");
                    }
                }).then(function(){
                    return "Branch was successfully shared";
                }, function(m){
                        var message = m.message || m;
                        if(message.indexOf("повторяющееся значение ключа") > -1){
                            return "Branch is already shared";
                        } else {
                            return message;
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
    }
});

module.exports = Bookshelf.model("Branch", branch);