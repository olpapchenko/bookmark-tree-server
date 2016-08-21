define(["angular", "app", "services/fbService"], function() {angular.module("app").controller("logoutController", ["$scope", "$http", "fbService", function ($scope, $http, fbService) {
    $http.post("/logout").then(function() {
        fbService.logout().then(function () {
            $scope.$state.go("login");
        });
    });
}]);});