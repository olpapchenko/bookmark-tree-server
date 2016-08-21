define(["angular", "app"], function() {
    angular.module("app").service("userService", ["$http", "$q", function($http, $q){
    this.login = function(user, password){
        return $http.post("/login", {mail: user, password: password});
    }

    this.loginByGoogle = function (tokenData) {
        return $http.post("/login/google", tokenData);
    }

    this.loginByFacebook = function (userData) {
        return $http.post("/login/facebook", userData).then(function (data) {
            return data.data;
        });
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

    this.checkMailAvailability = function (mail) {
        return $http.get("/user/mail/availability", {params: {mail: mail}}).then(function (data) {
            return data.data.available ? true : $q.reject("Mail is already in use");
        });
    }

    this.getByName = function(name){
        return $http.get("/user/" + name).then(function(data){
            return data.data;
        });
    }

    this.register = function (user) {
        return $http.post("/registration", user);
    }

    this.save = function (user) {
        return $http.post("/user/update", user);
    }
}]);});