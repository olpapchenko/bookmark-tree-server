var bookshelf = require ('../../config/db/bookshelf');
var encodeSHA = require("../helpers/encodeSHA");
var Bookmark = require('./bookmark');
var Rights = require('./rights');

var user = bookshelf.Model.extend({
    tableName: 'users',

    bookmarks: function () {
        return this.belongsToMany("Bookmark").through(Rights);
    },

    rights: function () {
        return this.hasMany("Right");
    }
}, {
    login: function (mail, password) {
        return new this({mail: mail}).fetch().then(function (user) {
            if (user) {
                return user.get("password") == encodeSHA(password) ? user.omit("password") : null;
            } else
                return null;
        });
    },

    register: function (userData){
        return new this({name: userData.name,
                  password: encodeSHA(userData.password),
                  about: userData.about,
                  mail: userData.mail}).save()
        .then(function  (model) {
           return model.omit("password");
        });
    }
});

module.exports = bookshelf.model("User", user);
