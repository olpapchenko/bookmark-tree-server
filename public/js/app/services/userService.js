angular.module("app").service("userService", ["$http",function($http){
    this.login = function(user, password){
        return $http.post("/login", {mail: user, password: password});
    }

    this.getCurrentUser = function(){
        return $http.get("/user").then(function(data){
            return data.data;
        });
    }

    this.get = function(id){
        return $http.get("/user/" + id).then(function(data){
            return data.data;
        });
    }

    this.getByName = function(name){
        return $http.get("/user/" + name).then(function(data){
            return data.data;
        });
    }

    this.register = function (user) {
        return $http.post("/user/register", user);
    }

    this.save = function (user) {
        return $http.post("/user/update", user);
    }
}]);