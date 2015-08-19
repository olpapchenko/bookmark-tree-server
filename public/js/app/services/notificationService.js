angular.module("app").service("notificationService", ["$http","$interval", function($http, $interval){
    var TRACK_PERIOD = 30;

    this.trackNotifications = function(fn){
        $http.get("/notifications").success(function(not){
            fn(not);
        });
        $interval(function () {
            $http.get("/notifications").success(function(not){
                fn(not);
            });
        }, TRACK_PERIOD * 1000)
    }

    this.markAllRead = function(id) {
        return $http.post("/notifications/read");
    }
}]);