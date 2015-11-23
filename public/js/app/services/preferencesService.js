angular.module("app").service("preferencesService", ["$http", function ($http) {
    this.save = function (preference) {
        console.log(preference);
        return $http.post("/preferences", preference);
    }

    this.get = function (key) {
        return $http.get("/preferences", {params: {key: key}});
    }
}]);