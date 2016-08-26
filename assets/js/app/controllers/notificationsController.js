define(["moment", "angular", "app", "moment-timezone-with-data-2010-2020"],
    function(moment) {angular.module("app").controller("notificationsController", ["$scope", "notifications", function ($scope, notifications) {
    $scope.notifications = notifications;
    $scope.notifications.forEach(function (item) {
        item.relative = moment.tz(item.created_at, 'America/Los_Angeles').fromNow();
    });
    $scope.showTime = false;
}])});