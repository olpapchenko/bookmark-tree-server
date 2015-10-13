angular.module("app").controller("overviewController", ["$scope", "branchService", "editHandler", "addBranchDatasource", function($scope, branchService, editHandler, addBranchDatasource){
    branchService.all().then(function (data) {
        $scope.branches = data;
    });

    $scope.addBranch = editHandler(addBranchDatasource);
}]);