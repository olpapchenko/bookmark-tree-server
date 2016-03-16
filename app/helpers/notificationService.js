var Promise = require("bluebird");
var cacheManager = require("./cacheManager");

var repos = {};
var Notification = require("../models/notification");
    repos.branch = require("../models/Branch");
    repos.user = require("../models/user");
    repos.bookmark = require("../models/Bookmark");



var MESSAGE_BODIES = [
    {type: 1,
     name: "bookmarkShareNotificationOwner",
     str: "Bookmark  {{bookmark}}  was shared with you by {{user}} with owner rights"
    },
    {type: 2,
     name: "bookmarkShareNotificationObserver",
     str: "Bookmark  {{bookmark}}  was shared with you by {{user}} with observer rights"
    },
    {type: 3,
     name: "bookmarkEditNotification",
     str: "Bookmark  {{bookmark}}  was edited by {{user}}"
    },
    {type: 4,
     name: "bookmarkRemoveNotification",
     str: "Bookmark  {{bookmark}}  was removed by {{user}}"
    },
    {type: 5,
     name: "bookmarkUnShareNotification",
     str: "Bookmark  {{bookmark}}  was un shared with you by {{user}}"
    },
    {type: 6,
     name: "branchEditNotification",
     str: "Branch  {{branch}}  was edited by {{user}}"
    },
    {type: 7,
     name: "branchShareNotificationOwner",
     str: "Branch  {{branch}}  was shared with you by {{user}} with owner rights"
    },
    {type: 8,
     name: "branchShareNotificationObserver",
     str: "Branch  {{branch}}  was shared with you by {{user}} with observer rights"
    },
    {type: 9,
     name: "branchUnShareNotification",
     str: "Branch  {{branch}}  was un shared with you by {{user}}"
    },
    {type: 10,
     name: "branchRemoveNotification",
     str: "Branch  {{branch}}  was removed by {{user}}"
    }
];

var getMessageDs = function(str){
     return str.match(/\{\{\w+\}\}/g).map(function(item){
        item = item.substring(2, item.indexOf("}"));
        return {repo: repos[item], name: item};
    });
}

var renderMessage = function(data, str) {
     return Promise.map(getMessageDs(str), function(repo) {
         return repo.repo.forge({id: data[repo.name]}).fetch();
    })
    .each(function(item) {
        str = str.replace(/\{\{\w+\}\}/, item.get("name"));
         return str;
    })
    .then(function(){
        return str;
    });
}

var service = {
    cache: new cacheManager(Notification),

    getAllByUserId: function (userId) {
        return this.cache.get(userId);
    },

    markAllRead: function (userId) {
        return this.cache.delete(userId, true).then(function () {
            return Notification.markAllRead(userId);
        });
    },

    sendMail: function() {
        //todo: send mail here
    },

    persist: function(message, messageType, userId, context){
        var message = {message: message, user_id: userId, type: messageType, context: context, is_read: false},
            _this = this;
        return Notification.forge(message).save()
               .then(function () {
                   return _this.cache.get(userId);
               }).then(function(data) {
                     var messages = (data || []);
                     messages.push(message)
                    _this.cache.putIntoCache(userId, messages);
               });
    }
}

MESSAGE_BODIES.forEach(function (message) {
    Object.defineProperty(service, message.name, {
        value: function(data, user_id, context_object) {
            var type = message.type;
            return renderMessage(data, message.str).then(function(message) {
                 return service.persist(message, type, user_id, context_object);
            });
        }
    });
});

module.exports = service;