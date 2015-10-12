 angular.module("app")
.directive("bookmarkPanel",["$rootScope", "ngDialog", "$state", "shareHandler", "shareDatasourceAllBranch", "shareDatasourceAllBookmark", "editHandler", "editBookmarkDatasource", "editBranchDatasource",
         function ($rootScope, ngDialog, $state, shareHandler, shareDatasourceAllBranch, shareDatasourceAllBookmark, editHandler, editBookmarkDatasource, editBranchDatasource) {
        return {
            restrict: "E",
            scope: {
                remove: "=",
                edit: "=",
                share: "=",
                entity: "=",
                branch: "=",
                enableEditing: "="
            },
            templateUrl: "/html/templates/branchBookmark.html",
            link: function(scope, iElement, attrs) {

                function getRemoveHandler(isBranch) {
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

                scope.removeHandler = scope.remove || getRemoveHandler(scope.branch);
                scope.editHandler = scope.edit || editHandler(scope.branch ? editBranchDatasource : editBookmarkDatasource);
                scope.shareHandler = scope.share || shareHandler(scope.branch ? shareDatasourceAllBranch : shareDatasourceAllBookmark);
            }
        }
    }]);