angular.module("app").controller("logoutController", ["$scope", "$http", function ($scope, $http) {
    $http.post("/logout").then(function() {
        $scope.$state.go("login");
    });
}]);