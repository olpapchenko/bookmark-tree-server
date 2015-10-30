angular.module("app").controller("registerController", ["userService", "$state", "$scope", function (userService, $state, $scope) {
    $scope.register = function () {
        userService.register($scope.user).then(function () {
            $state.go("app.overview");
        });
    }
}]);