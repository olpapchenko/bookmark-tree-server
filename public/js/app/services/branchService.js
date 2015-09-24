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

    this.getShareInfo = function (id) {
        return $http.get("/branch/share", {params: {id: id}});
    }

    this.share = function(id, users, ownership) {
        return $http.post("/branch/share", {id: id, users: users, ownership: ownership});
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