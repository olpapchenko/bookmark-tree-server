angular.module("app")
.service("bookmarkService",["$http", function ($http) {
    this.share = function(id, shareData) {
        return $http.post("/bookmark/share", {id: id, shareData: shareData});
    }

    this.persist = function(bookmark){
        return $http.post("/bookmark", {bookmark: bookmark});
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