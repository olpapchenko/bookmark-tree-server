angular.module("app").directive("switcheableView", ["$http", "$q", "$rootScope", "$compile", "$controller",
    function ($http, $q, $rootScope, $compile , $controller) {
        return {
            restrict: "E",
            scope: {
                scope: "=",
                datasource: "=",
                remote: "="
            },
            templateUrl: "/html/templates/switcheableView.html",

            link: function ($scope, iElement, attrs) {
                var $el = angular.element;
                $scope.isTurnedOn = false;

                function getTemplates() {
                    if ($scope.remote) {
                        var templates = [];
                        templates.push($http.get(attrs.one));
                        templates.push($http.get(attrs.two));
                        return $q.all(templates).then(function (templates) {
                            return templates.map(function (template) {
                                return $el(template);
                            })
                        });
                    } else {
                        return $q.when([$el(one), $el(two)]);
                    }
                }

                function bindController(controller, element, scope) {
                    if(controller && angular.isString(controller)) {
                        $controller(controller, {
                            $scope: scope,
                            $element: element
                        });
                    }
                }

                function getNewScope() {
                    return $scope.scope ? $scope.$new() : $rootScope.$new();
                }

                $scope.switch = function () {
                    $scope.isTurnedOn = ! $scope.isTurnedOn;
                    $rootScope.emit("switch.changed", $scope.isTurnedOn);
                }

                getTemplates().then(function (templates) {
                    var container1 = $el(iElement[0].querySelector("#content1")),
                        container2 = $el(iElement[0].querySelector("#content2")),
                        scope1 = getNewScope(),
                        scope2 = getNewScope;


                    container1.append(templates[0]);
                    container2.append(templates[1]);

                    bindController(attrs.controllerOne, container1, scope1);
                    bindController(attrs.controllerTwo, container2, scope2);

                    $compile(container1)(scope1);
                    $compile(container1)(scope2);

                });
            }
    }
}]);