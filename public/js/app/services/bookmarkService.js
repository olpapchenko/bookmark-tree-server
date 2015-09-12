angular.module("app")
.service("bookmarkService",["$http", function ($http) {
    this.share = function(id, users) {
        return $http.post("/bookmark/share", {id: id, users: users});
    }

    this.persist = function(bookmark){
        return $http.post("/bookmark", {bookmark: bookmark});
    }

    this.remove = function(id){
        return $http.post("/bookmark/remove", {id: id});
    }
}]);