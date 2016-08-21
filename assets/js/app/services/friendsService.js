define(["angular", "app"], function() {
    angular.module("app").service("friendsService", ["$http", function($http){

    this.all= function(){
        return $http.get("/friends").then(function(data){
            return data.data;
        });
    }

    this.addFriend = function(id){
        return $http.post("/friends",{id: id});
    }

    this.removeFriend = function(id) {
        return $http.post("/friends/remove", {id: id});
    }

    //get shared entities with friend
    //id - id of friend
    this.getSharedEntities = function (id){
        return $http.get("/friends/shared/" + id).then(function(data) {return data.data;});
    }
}]);});