angular.module("app").service("branchService", ["$http",function($http){
    this.all = function(){
       return $http.get("/branches").then(function(data){
            return data.data;
        })
    }
}]);