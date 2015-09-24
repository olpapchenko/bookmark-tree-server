angular.module("app").service("shareDatasourceFriends", ["shareDatasourceAll", "bookmarkService", "branchService",
function(shareDatasourceAll, bookmarkService, branchService) {
    this.all = shareDatasourceAll.all;
    this.getSharedWithFriendsBranch = branchService.getFriends;
    this.getSharedWithFriendsBookmark = bookmarkService.getFriends;
}])