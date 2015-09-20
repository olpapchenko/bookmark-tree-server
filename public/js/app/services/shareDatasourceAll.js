angular.module("app").service("shareDatasourceAll", ["friendsService", "$q", function (friendsService, $q){
    this.all = friendsService.all;

    this.getSharedWithFriendsBranch = function () {
        var d = $q.defer();
        d.resolve([]);
        return d.promise;
    }

    this.getSharedWithFriendsBookmark = this.getSharedWithFriendsBranch;
}]);