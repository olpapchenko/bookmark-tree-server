angular.module("app").controller("notificationsController", ["$scope", "notifications", function ($scope, notifications) {
    $scope.notifications = notifications;
    $scope.showTime = false;
}])