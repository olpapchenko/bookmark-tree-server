var repos = {};
var Notification = require("../models/notification");
repos.branch = require("../models/branch");
repos.user = require("../models/user");
repos.bookmark = require("../models/bookmark");
var Promise = require("bluebird");

var MESSAGE_BODIES = [
    {name: "bookmarkShareNotification",
     str: "Bookmark  {{bookmark}}  was shared with you by {{user}}"
    },
    {name: "bookmarkEditNotification",
     str: "Bookmark  {{bookmark}}  was edited by {{user}}"
    },
    {name: "bookmarkRemoveNotification",
     str: "Bookmark  {{bookmark}}  was removed by {{user}}"
    },
    {name: "branchEditNotification",
     str: "Branch  {{branch}}  was edited by {{user}}"
    },
    {name: "branchShareNotification",
     str: "Branch  {{branch}}  was shared with you by {{user}}"
    },
    {name: "branchRemoveNotification",
     str: "Branch  {{branch}}  was removed by {{user}}"
    }

];

var getMessageDs = function(str){
    return str.match(/\{\{\w+\}\}/g).map(function(item){
        item = item.substring(2,item.indexOf("}"));
        return repos["item"];
    });
}

var renderMessage = function(data, str){
    return Promise.map(function(item, index) {
       return item.forge(data[index]).fetch();
    },getMessageDs(str))
    .then(function(data){
        data.forEach(function(item) {
            str.replace(/\{\{\w+\}\}/, item);
        });
        return str;
    });
}

var service = {
    sendMail: function() {
        //todo: send mail here
    },
    persist: function(message, user_id){
        return Notification.forge({message: message, user_id: userId}).save();
    }
}

MESSAGE_BODIES.forEach(function (message) {
    Object.defineProperty(service, message.name, {
        value: function(data, user_id){
                   return renderMessage(data, message.str).then(function(message) {
                        return this.persist(message, user_id);
               });
        }
    });
});

module.exports = service;