var bookshelf = require ('../../config/db/bookshelf'),
    AbstractModel = require("./AbstractModel");


var preferences = AbstractModel.extend({
    tableName: 'preferences',

    user: function () {
        this.belongsTo("User");
    }
}, {
    EXTENSION_ENABLED: 0,
    BOOKMARK_LINKS_ENABLED: 1,
    MARKS_ENABLED: 2,
    COMMENTS_ENABLED: 3,
    NOTIFICATIONS_ENABLED: 4,
    MARK_COLOR: 5,
    REFRESH_PERIOD: 6,
    OVERVIEW_LIST_VIEW: 7,
    FRIENDS_BRANCH_LIST_VIEW: 8,
    FRIENDS_BOOKMARKS_LIST_VIEW: 9,
    BOOKMARK_LIST_VIEW: 10,
    SUMMARIZE_PERCENTAGE: 11,
    SUMMARIZE_COLOR: 12,

    getPreferencesOrDefault: function (preferences) {
        return this.query({where: preferences}).fetchAll().then(function (preferences) {
            defaultPreferences.forEach(function (defPreference) {
                if(!preferences.some(function (model) {return model.get("key") == String(defPreference.key)})) {
                    preferences.push(defPreference);
                }
            });
            return  preferences;
        });
    }
});

var defaultPreferences  = [
    {key: preferences.SUMMARIZE_PERCENTAGE, value: 0.75},
    {key: preferences.SUMMARIZE_COLOR, value: '#F8F503'},
    {key: preferences.EXTENSION_ENABLED, value: true},
    {key: preferences.BOOKMARK_LINKS_ENABLED, value: true},
    {key: preferences.MARKS_ENABLED, value: true},
    {key: preferences.COMMENTS_ENABLED, value: true},
    {key: preferences.NOTIFICATIONS_ENABLED, value: true},
    {key: preferences.MARK_COLOR, value: '#F8F503'},
    {key: preferences.REFRESH_PERIOD, value: 10},
    {key: preferences.OVERVIEW_LIST_VIEW, value: false},
    {key: preferences.FRIENDS_BRANCH_LIST_VIEW, value: false},
    {key: preferences.FRIENDS_BOOKMARKS_LIST_VIEW, value: false},
    {key: preferences.BOOKMARK_LIST_VIEW, value: false}
];

module.exports = bookshelf.model("Preference", preferences);