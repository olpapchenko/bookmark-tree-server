angular.module("app").controller("overviewController", ["$scope", "branchService", "editHandler", "addBranchDatasource", function($scope, branchService, editHandler, addBranchDatasource){
    branchService.all().then(function (data) {
        $scope.entities = data;
    });

    $scope.scope = $scope;

    $scope.addBranch = editHandler(addBranchDatasource);
}]);