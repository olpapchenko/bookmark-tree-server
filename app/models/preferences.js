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
        return this.forge(preferences).fetch().then(function (preferences) {
            return preferences ? preferences: defaultPreferences;
        });
    }
});

var defaultPreferences  = {};
defaultPreferences[preferences.EXTENSION_ENABLED] = true;
defaultPreferences[preferences.BOOKMARK_LINKS_ENABLED] = true;
defaultPreferences[preferences.MARKS_ENABLED] = true;
defaultPreferences[preferences.COMMENTS_ENABLED] = true;
defaultPreferences[preferences.NOTIFICATIONS_ENABLED] = true;
defaultPreferences[preferences.MARK_COLOR] = "";
defaultPreferences[preferences.REFRESH_PERIOD] = 10;

module.exports = bookshelf.model("Preference", preferences);