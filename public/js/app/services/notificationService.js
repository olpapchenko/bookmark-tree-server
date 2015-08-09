angular.module("app").service("notificationService", ["$http","$timeout", function($http, $timeout){
    var TRACK_PERIOD = 10;

    this.trackNotifications = function(notifications){
        $timeout(function () {
            $http.get("/notification").success(function(not){
                notifications = not;
            })
        }, TRACK_PERIOD*1000)
    }

    this.markReaded = function(id) {
        return $http.post("/notifications/readed", {id: id});
    }
}]);