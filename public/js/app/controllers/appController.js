angular.module("app").controller("appController", ["$scope", "notificationService", "ngProgressFactory", "$rootScope", function($scope, notificationService, ngProgressFactory, $rootScope){
    var DEFAULT_AVATAR = "/images/user-small.png",
        UPLOAD_PATH = "/avatars/";

    $scope.avatar = (UPLOAD_PATH + $scope.user.avatar) || DEFAULT_AVATAR;

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