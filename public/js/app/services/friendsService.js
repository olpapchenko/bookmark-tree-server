angular.module("app").service("friendsService", ["$http", function($http){

    this.get= function(){
        return $http.get("/friends").then(function(data){
            return data.data;
        });
    }

    this.addFriend = function(id){
        return $http.post("/friends",{id: id});
    }
}]);