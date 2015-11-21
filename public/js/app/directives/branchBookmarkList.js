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
            entities: "=",
            isBranch: "=",
            edit: "=?",
            share: "=?",
            remove: "=?",
            enableEditing: "=?",
            filterPredicate: "=",
            currentUser: "="
        },
        templateUrl: "/html/templates/branchBookmarkList.html",

        link: function (scope, element, attr){

            scope.removeHandler = scope.remove || removeHandler(scope.isBranch);
            scope.editHandler = scope.edit || editHandler(scope.isBranch ? editBranchDatasource : editBookmarkDatasource);
            scope.shareHandler = scope.share || shareHandler(scope.isBranch ? shareDatasourceAllBranch : shareDatasourceAllBookmark);
        }
    }
}]);