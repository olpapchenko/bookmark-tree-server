var bookshelf = require ('../../config/db/bookshelf');
var encodeSHA = require("../helpers/encodeSHA");
var Bookmark = require('./bookmark');
var Rights = require('./rights');

module.exports = bookshelf.Model.extend({
    tableName: 'users',

    bookmark: function () {
        return this.hasMany(Bookmark);
    },

    rights: function () {
        return this.hasMany(Rights);
    }
}, {
    login: function (mail, password) {
        var user  = new this({mail: mail}).fetch();
        if (user) {
            return user.password == encodeSHA(password) ? user.id : null;
        } else
        return null;
    },
    register: function (userData){
        new this({userName: userData.userName, password: encodeSHA(userData.password), about: userData.about, mail: userData.mail}).save();
    }
});
