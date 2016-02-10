var bookshelf = require ('../../config/db/bookshelf'),
    AbstractModel = require("./AbstractModel");


var preferences = AbstractModel.extend({
    tableName: 'preferences',

    user: function () {
        this.belongsTo("User");
    }
}, {
    EXTENSION_ENABLED: 1,
    BOOKMARK_LINKS_ENABLED: 2,
    MARKS_ENABLED: 3,
    COMMENTS_ENABLED: 4,
    NOTIFICATIONS_ENABLED: 5,
    MARK_COLOR: 6,
    REFRESH_PERIOD: 7,

    getPreferencesOrDefault: function (preferences) {
        return this.forge(preferences).fetchAll().then(function (preferences) {
            return preferences ? preferences: defaultPreferences;
        });
    }
});

var defaultPreferences  = [
    {key: preferences.EXTENSION_ENABLED, value: true},
    {key: preferences.BOOKMARK_LINKS_ENABLED, value: true},
    {key: preferences.MARKS_ENABLED, value: true},
    {key: preferences.COMMENTS_ENABLED, value: true},
    {key: preferences.NOTIFICATIONS_ENABLED, value: true},
    {key: preferences.MARK_COLOR, value: '#F8F503'},
    {key: preferences.REFRESH_PERIOD, value: 10}];

module.exports = bookshelf.model("Preference", preferences);