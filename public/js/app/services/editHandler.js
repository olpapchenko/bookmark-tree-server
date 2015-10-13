angular.module("app").factory("editHandler", ["$rootScope", "ngDialog", function ($rootScope, ngDialog){
    return function (datasource) {
        return function  (entity) {
            var scope = $rootScope.$new();
            scope.datasource = datasource;
            scope.entity = entity;
            var dialog = ngDialog.open({
                template: '/html/templates/editBranch.html',
                controller: "editBranchController",
                scope: scope
            });
        }
    }
}]);
