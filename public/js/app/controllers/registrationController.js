angular.module("app").controller("registerController", ["userService", "$state", function (userService, $state) {
    $scope.register = function () {
        userService.register($scope.user).then(function () {
            $state.go("app.overview");
        });
    }
}]);