define(["app"], function() {angular.module("app").directive("notification", ["$state", function ($state) {
    return {
        scope: {
            notif: "=",
            showTime: "=?"
        },

        templateUrl: "/html/templates/notifications.html",

        restrict: "E",

        link: function (scope) {
            scope.showTime = scope.showTime;

            var TYPE2PATH =["app.user",
                            "app.user",
                            "app.user",
                            "app.user",
                            "app.user",
                            "app.branch",
                            "app.branch",
                            "app.branch",
                            "app.user",
                            "app.user"];

            scope.navigateToContext = function (type, context) {
                $state.go(TYPE2PATH[type-1], {id: context});
            }
        }
    }
}]);});