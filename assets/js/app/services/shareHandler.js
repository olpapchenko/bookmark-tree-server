angular.module("app").factory("shareHandler", ["$rootScope", "ngDialog", function ($rootScope, ngDialog){
    return function getShareHandler(datasource) {
        return function(id) {
            var scope = $rootScope.$new();
            scope.id = id;
            scope.datasource = datasource;
            var dialog = ngDialog.open({
                template: '/html/templates/share.html',
                controller: "shareController",
                scope: scope
            });
        }
    }
}]);