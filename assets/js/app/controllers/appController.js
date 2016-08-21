define(["angular", "app", "services/notificationService", "services/avatarService", "ngProgress"], function() {
angular.module("app").controller("appController", ["$scope", "$state", "notificationService", "ngProgressFactory", "$rootScope", "avatarService",
        function($scope, $state, notificationService, ngProgressFactory, $rootScope, avatarService){

        $scope.avatar = avatarService.getPath($scope.currentUser.avatar, $scope.currentUser.origin);

        $scope.allNotifications = function () {
            $state.go("app.notifications");
        }

         var progress = ngProgressFactory.createInstance();

        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
            if(toState.name == 'login') {
                return;
            }

            progress.start();
        });

        $rootScope.$on("$stateChangeSuccess", function () {
            progress.complete();
        });

        notificationService.trackNotifications(function(not){
            $scope.notifications = not;
            $scope.notifications.forEach(function(item){
                item.relative = moment.tz(item.created_at, 'America/Los_Angeles').fromNow();
            });
            $scope.notificationsCount = not.length;
        });

        $scope.markAllRead = function(){
            notificationService.markAllRead();
        }
    }])
});