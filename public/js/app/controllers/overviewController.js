angular.module("app").controller("overviewController", ["$scope", "branchService", "ngDialog", function($scope, branchService, ngDialog){
    branchService.all().then(function (data) {
        $scope.branches = data;
    });

    $scope.addBranch = function () {
        $scope.header = "Add branch";
        $scope.isBranch = true;
        var dialog = ngDialog.open({
            template: '/html/templates/editBranch.html',
            controller: "editBranchController",
            scope: $scope
        });
        dialog.closePromise.then(function(){
            $scope.$state.reload();
        })
    }
}]);