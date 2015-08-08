angular.module("app").service("friendsService", ["$http", function($http){

    this.get= function(){
        return $http.get("/friends").then(function(data){
            return data.data;
        });
    }
}]);