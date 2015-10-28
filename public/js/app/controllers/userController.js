angular.module("app").controller("userController", ["$scope", "user", avatarService, function ($scope, user, avatarService) {
    $scope.avatar = user.avatar || avatarService.getPath($scope.user.avatar);
}]);