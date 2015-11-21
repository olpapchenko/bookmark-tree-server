angular.module("app").directive("branchBookmarkList", ["editHandler",
    "removeHandler",
    "shareHandler",
    "editBranchDatasource",
    "editBookmarkDatasource",
    "shareDatasourceAllBranch",
    "shareDatasourceAllBookmark",
    function (editHandler,
              removeHandler,
              shareHandler,
              editBranchDatasource,
              editBookmarkDatasource,
              shareDatasourceAllBranch,
              shareDatasourceAllBookmark
    ) {
    return {
        restrict: "E",
        scope: {
            entity: "=",
            isBranch: "=",
            edit: "=?",
            share: "=?",
            remove: "=?",
            isOwner: "=",
            enableEditing: "=?"
        },
        templateUrl: "/html/templates/branchBookmarkList.html",

        link: function (scope, element, attr){
            scope.enableEditing = scope.enableEditing || scope.isOwner;

            scope.removeHandler = scope.remove || removeHandler(scope.isBranch);
            scope.editHandler = scope.edit || editHandler(scope.isBranch ? editBranchDatasource : editBookmarkDatasource);
            scope.shareHandler = scope.share || shareHandler(scope.isBranch ? shareDatasourceAllBranch : shareDatasourceAllBookmark);
        }
    }
}]);