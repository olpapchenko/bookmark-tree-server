angular.module("app").service("preferencesService", ["$http", function ($http) {
    String.prototype.capitalizeFirstLetter = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }

    var PREFERENCES_KEYS = "overviewListView friendsBranchListView friendsBookmarkListView bookmarkListView".split(" "),
        _this = this;

    PREFERENCES_KEYS.forEach(function (key) {
        _this["get" + key.capitalizeFirstLetter()] = function () {
            return $http.get("/preferences", {params: {key: key}}).then(function (preference) {
                return !preference.data || preference.data.value === 'true';
            });
        }
    });

    PREFERENCES_KEYS.forEach(function (key) {
        _this["save" + key.capitalizeFirstLetter()] = function (preference) {
            return $http.post("/preferences", {key: key, value: preference});
        }
    });



}]);