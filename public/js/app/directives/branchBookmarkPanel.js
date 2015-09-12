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
                function share(id) {
                    var scope = $rootScope.$new();
                    scope.id = id;
                    var dialog = ngDialog.open({
                        template: '/html/templates/share.html',
                        controller: "shareController",
                        scope: scope
                    });
                };

                function edit(branch) {
                    var scope = $rootScope.$new();
                    scope.branch = branch;
                    scope.header = "Edit branch";
                    var dialog = ngDialog.open({
                        template: '/html/templates/editBranch.html',
                        controller: "editBranchController",
                        scope: scope
                    });
                    dialog.closePromise.then(function(){
                        $state.reload();
                    });
                };

                function remove(id) {
                    var scope = $rootScope.$new();
                    scope.id = id;
                    var dialog = ngDialog.open({
                        template: '/html/templates/removeBranch.html',
                        controller: "removeBranchController",
                        scope: scope
                    });
                    dialog.closePromise.then(function(){
                        $state.reload();
                    });
                };

                scope.removeHandler = scope.remove || remove;
                scope.editHandler = scope.edit || edit;
                scope.shareHandler = scope.share || share;
            }
        }
    }]);