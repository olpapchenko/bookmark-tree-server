angular.module("app").service("preferencesService", ["$http", function ($http) {
    String.prototype.capitalizeFirstLetter = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }

    var PREFERENCES_KEYS = "extensionEnabled bookmarkLisEnabled marksEnabled commentEnabled notificationEnabled markColor refreshPeriod overviewListView friendsBranchListView friendsBookmarkListView bookmarkListView".split(" "),
        _this = this;

    PREFERENCES_KEYS.forEach(function (key, index) {
        'use strict'
        _this["get" + key.capitalizeFirstLetter()] = function () {
            return $http.get("/preferences", {params: {key: index}}).then(function (preference) {
                var pref = preference.data.preferences.find(function (curPreference) {
                    return curPreference.key == index;
                });
                console.log(pref);
                return pref && pref.value == "true";
            });
        }
    });

    PREFERENCES_KEYS.forEach(function (key, index) {
        _this["save" + key.capitalizeFirstLetter()] = function (preference) {
            return $http.post("/preferences", {preferences: [{key: index, value: preference}]});
        }
    });
}]);