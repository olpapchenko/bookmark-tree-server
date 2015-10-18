angular.module("app").controller("profileController", ["$scope", "userService", "toaster", function($scope, userService, toaster){
    var DEFAULT_AVATAR = "/images/user-moderate.png";

    $scope.avatar = $scope.user.avatar || DEFAULT_AVATAR;
    
    $scope.save = function () {
        userService.save().then(function () {
            toaster.pop('success', "User updated", "User successfully updated");
        }, function () {
            toaster.pop('error', 'Error', 'Some error occurred');
        });
    }
}]);