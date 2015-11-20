angular.module("app").factory("removeHandler", ["$rootScope", "ngDialog", "$state", function ($rootScope, ngDialog, $state) {
    return function getRemoveHandler(isBranch) {
        return function (id) {
            var scope = $rootScope.$new();
            scope.id = id;
            scope.isBranch = isBranch;
            var dialog = ngDialog.open({
                template: '/html/templates/removeBranch.html',
                controller: 'removeBranchController',
                scope: scope
            });
            dialog.closePromise.then(function(){
                $state.reload();
            });
        }
    };
}]);