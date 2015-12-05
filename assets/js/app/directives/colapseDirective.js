
angular.module('app')
    .directive('collapse', ['$injector', '$controller', '$rootScope', '$compile', "$http", function ($injector, $controller, $rootScope, $compile, $http) {
        return {
            transclude: true,
            replace: true,
            scope: {
                scope: "=",
                controller: '@',
                resolve: "=",
                controller: "=",
                headerTemplate: "@",
                remote: "=",
                locals: "="
            },
            template: "<div class='collapse-container' ng-click='toggle()'>" +
                        "<div class='collapse-header'></div>" +
                        "<div ng-show='showContent' class='collapse-content'></div>" +
                      "</div>",
            link: function ($scope, iElement, $element, controller, transclude) {
                var resolve = {};

                var contentScope = $scope.scope && angular.isObject($scope.scope) ? $scope.scope.$new() : $rootScope.$new();
                contentScope = angular.extend(contentScope, $scope.locals);

                var headerTemplate = $scope.remote ? $http.get($scope.headerTemplate) : $scope.headerTemplate;

                var transclFunction = function(clone) {
                    angular.forEach($scope.resolve, function(key, value){
                        resolve[key] = angular.isString(value) ? $injector.get(value): $injector.invoke(value);
                    });

                    $q.all({headerTemplate: headerTemplate, resolve: resolve}).then(function (resolved){
                        var header = angular.element(iElement.querySelector(".collapse-header")).append($compile(resolved.headerTemplate)(contentScope));
                        var container = angular.element(iElement.querySelector(".collapse-content")).append(clone);
                        if($scope.controller && angular.isFunction(controller)){
                            $controller($scope.controller, angular.extend({$scope: contentScope, $element: container}, resolved.resolve));
                        }
                    });
                }

                $scope.showContent = false;

                $scope.toggle = function () {
                    return $scope.showContent = !$scope.showContent;
                };

                transclude(contentScope, transclFunction);
            }
        };
    }]);

