angular.module("app").service("userService", ["$http",function($http){
    this.login = function(user, password){
        return $http.post("/login", {mail: user, password: password});
    }

    this.getUser = function(){
        return $http.get("/user").then(function(data){
            return data.data;
        });
    }

    this.getByName = function(name){
        return $http.get("/user", {name: name}).then(function(data){
            return data.data;
        });
    }
}]);