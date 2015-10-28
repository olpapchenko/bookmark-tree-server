angular.module("app").controller("appController", ["$scope", "$state", "notificationService", "ngProgressFactory", "$rootScope", "avatarService",
    function($scope, $state, notificationService, ngProgressFactory, $rootScope, avatarService){

    $scope.avatar = avatarService.getPath($scope.currentUser.avatar);

    $scope.allNotifications = function () {
        $state.go("app.notifications");
    }

     var progress = ngProgressFactory.createInstance();

    $rootScope.$on("$stateChangeStart", function () {
        progress.start();
    });

    $rootScope.$on("$stateChangeSuccess", function () {
        progress.complete();
    });

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