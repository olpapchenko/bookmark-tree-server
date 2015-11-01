angular.module("app").controller("registerController", ["userService", "$state", "$scope", function (userService, $state, $scope) {
    $scope.register = function () {
        if($scope.register_form.$invalid) {
            return;
        }

        console.log("register");
        userService.register($scope.user).then(function () {
            $state.go("app.overview");
        });
    }
}]);