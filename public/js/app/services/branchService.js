angular.module("app").service("branchService", ["$http",function($http){
    this.all = function() {
        return $http.get("/branches").then(function (data) {
            var branches = data.data;
            branches.forEach(function (item, index) {
                if (item.default) {
                    var temp = branches[0];
                    branches[0] = item;
                    branches[index] = temp;
                }
            });
            return branches;
        })
    }

    this.getShareInformation = function (id) {
        return $http.get("/branch/share", {params:{id: id}}).then(function(data) {return data.data});
    }

    this.share = function(id, shareData) {
        return $http.post("/branch/share", {id: id, shareData: shareData});
    }

    this.persist = function(branch){
        return $http.post("/branch", {branch: branch});
    }

    this.remove = function(id){
        return $http.post("/branch/remove", {id: id});
    }

    this.getFriends = function (id) {
        return $http.get("/branch/friends", {id: id});
    }
}]);