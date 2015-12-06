angular.module("app").directive("notification", ["$state", function ($state) {
    return {
        scope: {
            notif: "=",
            showTime: "=?"
        },

        templateUrl: "/html/templates/notifications.html",

        restrict: "E",

        link: function (scope) {
            scope.showTime = scope.showTime || true;

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
                console.log("t " + TYPE2PATH[type]);
                $state.go(TYPE2PATH[type-1], {id: context});
            }
        }
    }
}]);