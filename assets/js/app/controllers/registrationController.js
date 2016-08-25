define(["angular", "app", "services/userService"], function() {
    angular.module("app").controller("registerController", ["userService", "$state", "$scope", "ngProgressFactory", "toaster",
        function (userService, $state, $scope, ngProgressFactory, toaster) {
    $scope.register = function () {
        if($scope.register_form.$invalid) {
            return;
        }

        $scope.user.origin = 1;
        var progress = ngProgressFactory.createInstance();
        progress.start();

        userService.register($scope.user).then(function () {
            $state.go("app.overview");
        }, function () {
            toaster.pop('error', 'Error', 'Some error occurred');
        }).finally(function () {
            progress.complete();
        });
    }
}]);});