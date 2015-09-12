 angular.module("app")
.directive("bookmarkPanel",["$rootScope", "ngDialog", "$state", function ($rootScope, ngDialog, $state) {
        return {
            restrict: "E",
            scope: {
                remove: "=",
                edit: "=",
                share: "=",
                entity: "=",
                branch: "="
            },
            templateUrl: "/html/templates/branchBookmark.html",
            link: function(scope, iElement, attrs) {
                function getShareHandler(isBranch) {
                    return function(id) {
                        var scope = $rootScope.$new();
                        scope.id = id;
                        scope.isBranch = isBranch;
                        var dialog = ngDialog.open({
                            template: '/html/templates/share.html',
                            controller: "shareController",
                            scope: scope
                        });
                    }
                };

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
                $rootScope.$on('$stateNotFound',
                    function(event, toState, toParams, fromState, fromParams){ console.log("to" + JSON.stringify(toState))})
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
                scope.shareHandler = scope.share || getShareHandler(scope.branch);
            }
        }
    }]);