define(["app"], function() {
    angular.module("app").directive("switcheableView", ["$http", "$q", "$rootScope", "$compile", "$controller", "$timeout",
    function ($http, $q, $rootScope, $compile , $controller, $timeout) {
        return {
            restrict: "E",
            scope: {
                scope: "=",
                remote: "=",
                isTurnedOn: "=",
                entities: "=",
                changeHandler: "&"
            },
            templateUrl: "/html/templates/switcheableView.html",

            link: function ($scope, iElement, attrs) {
                var $el = angular.element,
                    scope1 = getNewScope();

                function getTemplates() {
                    if ($scope.remote) {
                        var templates = [];
                        templates.push($http.get(attrs.one));
                        templates.push($http.get(attrs.two));

                        if(attrs.header) {
                            templates.push($http.get(attrs.header));
                        }
                        return $q.all(templates).then(function (templates) {
                            return templates.map(function (template) {
                                return $el(template.data);
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
                    return $scope.scope ? $scope.scope.$new() : $rootScope.$new();
                }

                $scope.switch = function () {
                    scope1.isTurnedOn = !scope1.isTurnedOn;
                    $rootScope.$emit("switch.changed"  +  $scope.isTurnedOn);
                    $scope.changeHandler({flag: scope1.isTurnedOn});
                }

                getTemplates().then(function (templates) {
                    var container1 = $el(iElement[0].querySelector("#content1")),
                        container2 = $el(iElement[0].querySelector("#content2")),
                        header = $el(iElement[0].querySelector("#header"));

                    //setup scope
                    scope1.isTurnedOn = $scope.isTurnedOn;
                    scope1.entities = scope1.entities || $scope.entities;

                    container1.append(templates[0]);
                    container2.append(templates[1]);

                    if(templates[2]) {
                        header.append(templates[2]);
                    }

                    bindController(attrs.controllerOne, container1, scope1);
                    bindController(attrs.controllerTwo, container2, scope1);

                    $timeout(function () {
                        $compile(container1)(scope1);
                        $compile(container2)(scope1);
                        $compile(header)(scope1);
                    });

                });
            }
    }
}]);});