angular.module("app").directive("switcheableView", ["$http", "$q", "$rootScope", "$compile", "$controller", function ($http, $q, $rootScope, $compile , $controller) {
    return {
        restrict: "E",
        scope: {
            scope: "=",
            datasource: "=",
            one: "@",
            two: "@",
            remote: "="
        },
        tenplateUrl: "/html/templates/switcheableView.html",

        link: function ($scope, iElement, attrs) {
            $scope.isOneActive = false;

            function getTemplate( ) {
                if ($scope.remote) {
                    var templates = [];
                    templates.push($http.get($scope.one));
                    templates.push($http.get($scope.two));
                    return $q.all(templates);
                } else {
                    return $q.when([one, two]);
                }
            }

            var scope = $scope.scope ? $scope.$new() : $rootScope.$new();

            if(attrs.controller && angular.isString(attrs.controller)) {
                iElement.data(attrs.controller, {
                    $scope: scope,
                    $element: iElement
                });
            }


            scope.switch = function () {
                $scope.isOneActive = ! $scope.isOneActive;
                $rootScope.emit("switch.changed", $scope.isOneActive);
            }


        }
    }
}]);