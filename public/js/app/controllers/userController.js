angular.module("app").controller("userController", ["$scope", "user", "avatarService", "friendsService", "$state", "toaster",
    function ($scope, user, avatarService, friendsService, $state, toaster) {
        $scope.avatar = avatarService.getPath(user.avatar);
        $scope.user = user;
        $scope.pageOfCurrentUser = user.id == $scope.currentUser.id;

        $scope.addToFriends = function () {
            friendsService.addFriend(user.id);
            toaster.pop('success', "Friend added", "You are now friends with " + user.name);
            $state.reload();
        }

        $scope.removeFromFriends = function () {
            friendsService.removeFriend(user.id);
            toaster.pop('success', "Friend removed", "User " + user.name + "removed from friends");
            $state.reload();
        }
}]);