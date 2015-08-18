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
}]);