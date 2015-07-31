angular.module("app").service("userService", ["$http",function($http){
    this.login = function(user, password){
        return $http.post("/login", {mail: user, password: password});
    }
}]);