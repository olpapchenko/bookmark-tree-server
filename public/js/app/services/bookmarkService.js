angular.module("app")
.service("bookmarkService",["$http", function ($http) {
    this.get = function (id) {
        return $http.get("/bookmark", {params: {id: id}}).then(function (bookmark) {
            return bookmark.data;
        })
    }

    this.allByBranch = function (id) {
        $http.get("/bookmark/branch", {params: {id: id}});
    }

    this.share = function(shareData) {
        return $http.post("/bookmark/share", shareData);
    }

    this.persist = function(bookmark){
        return $http.post("/bookmark", bookmark);
    }

    this.remove = function(id){
        return $http.post("/bookmark/remove", {id: id});
    }

    this.getFriends = function(id) {
        return $http.get("/bookmark/friends", {id: id});
    }

    this.getShareInformation = function (id) {
        return $http.get("/bookmark/share", {params:{id: id}}).then(function(data) {return data.data;});
    }
}]);