 angular.module("app")
.directive("bookmarkPanel",[
         "$rootScope",
         "ngDialog",
         "$state",
         "shareHandler",
         "branchDatasource",
         "bookmarkDatasource",
         "shareDatasourceAllBranch",
         "shareDatasourceAllBookmark",
         "editHandler",
         "editBookmarkDatasource",
         "editBranchDatasource",
         "removeHandler",
         function ($rootScope,
                   ngDialog,
                   $state,
                   shareHandler,
                   branchDatasource,
                   bookmarkDatasource,
                   shareDatasourceAllBranch,
                   shareDatasourceAllBookmark,
                   editHandler,
                   editBookmarkDatasource,
                   editBranchDatasource,
                   removeHandler) {
        return {
            restrict: "E",
            scope: {
                remove: "=",
                edit: "=",
                isOwner: "=?",
                share: "=",
                entity: "=",
                isBranch: "=",
                enableEditing: "=?"
            },
            templateUrl: "/html/templates/branchBookmark.html",

            link: function(scope, iElement, attrs) {

                scope.enableEditing = scope.enableEditing || scope.isOwner;

                scope.navigatePath = scope.isBranch ? branchDatasource.path : bookmarkDatasource.path;
                scope.removeHandler = scope.remove || removeHandler(scope.isBranch);
                scope.editHandler = scope.edit || editHandler(scope.isBranch ? editBranchDatasource : editBookmarkDatasource);
                scope.shareHandler = scope.share || shareHandler(scope.isBranch ? shareDatasourceAllBranch : shareDatasourceAllBookmark);
            }
        }
    }]);