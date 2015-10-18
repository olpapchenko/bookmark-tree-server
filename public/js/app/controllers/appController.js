angular.module("app").controller("appController", ["$scope", "notificationService", function($scope, notificationService){
    var DEFAULT_AVATAR = "/images/user-small.png";

    $scope.avatar = $scope.user.avatar || DEFAULT_AVATAR;

    notificationService.trackNotifications(function(not){
        $scope.notifications = not;
        $scope.notifications.forEach(function(item){
            item.relative = moment($scope.notifications.created_at).fromNow();
        });
        $scope.notificationsCount = not.length;
    });

    $scope.markAllRead = function(){
        notificationService.markAllRead();
    }
}]);