define(["app", "services/editHandler",
"datasources/branchDatasource","datasources/bookmarkDatasource",
"datasources/shareDatasourceAllBranch","datasources/shareDatasourceAllBookmark",
"datasources/editBookmarkDatasource", "datasources/editBranchDatasource", "services/removeHandler"], function() { angular.module("app")
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
                entities: "=",
                remove: "=",
                edit: "=",
                share: "=",
                isBranch: "=",
                enableEditing: "=?",
                filterPredicate: "=",
                currentUser: "="
            },
            templateUrl: "/html/templates/branchBookmark.html",

            link: function(scope, iElement, attrs) {

                scope.navigatePath = scope.isBranch ? branchDatasource.path : bookmarkDatasource.path;
                scope.linkTarget = scope.isBranch ? "_self" : "_blank";

                var rmHandler = scope.remove || removeHandler(scope.isBranch);

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
    }]);});