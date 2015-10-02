 angular.module("app")
.directive("bookmarkPanel",["$rootScope", "ngDialog", "$state", "shareHandler", "shareDatasourceAllBranch", "shareDatasourceAllBookmark",
         function ($rootScope, ngDialog, $state, shareHandler, shareDatasourceAllBranch, shareDatasourceAllBookmark) {
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
                function getEditHandler(isBranch) {
                    return function  (branch) {
                        var scope = $rootScope.$new();
                        scope.branch = branch;
                        scope.isBranch = isBranch;
                        var dialog = ngDialog.open({
                            template: '/html/templates/editBranch.html',
                            controller: "editBranchController",
                            scope: scope
                        });
                    }
                };

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
                scope.editHandler = scope.edit || getEditHandler(scope.branch);
                scope.shareHandler = scope.share || shareHandler(scope.branch ? shareDatasourceAllBranch : shareDatasourceAllBookmark);
            }
        }
    }]);