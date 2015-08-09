angular.module("app").controller("appController", ["$scope", "notificationService", function($scope, notificationService){
    notificationService.trackNotifications(function(not){
        $scope.notifications = not;
        $scope.notifications.forEach(function(item){
            item.relative = moment($scope.notifications.created_at).fromNow();
        });
        $scope.notificationsCount = not.length;
    });
}]);