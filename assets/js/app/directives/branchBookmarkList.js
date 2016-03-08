angular.module("app").directive("branchBookmarkList", ["editHandler",
    "removeHandler",
    "shareHandler",
    "editBranchDatasource",
    "editBookmarkDatasource",
    "shareDatasourceAllBranch",
    "shareDatasourceAllBookmark",
    "branchDatasource",
    "bookmarkDatasource",
    function (editHandler,
              removeHandler,
              shareHandler,
              editBranchDatasource,
              editBookmarkDatasource,
              shareDatasourceAllBranch,
              shareDatasourceAllBookmark,
              branchDatasource,
              bookmarkDatasource
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

            var rmHandler = scope.remove || removeHandler(scope.isBranch);
            scope.navigatePath = scope.isBranch ? branchDatasource.path : bookmarkDatasource.path;
            scope.linkPath = scope.isBranch ? "_self" : "_blank";

            scope.removeHandler = function (id) {
                rmHandler(id).then(function (value) {
                    if(!value.value) {
                        return;
                    }

                    for (var el = 0; el < scope.entities.length; el++) {
                        if (scope.entities[el].id == id) {
                            scope.entities.splice(el, 1);
                            return;
                        }
                    }
                });
            };

            scope.editHandler = scope.edit || editHandler(scope.isBranch ? editBranchDatasource : editBookmarkDatasource);
            scope.shareHandler = scope.share || shareHandler(scope.isBranch ? shareDatasourceAllBranch : shareDatasourceAllBookmark);
        }
    }
}]);