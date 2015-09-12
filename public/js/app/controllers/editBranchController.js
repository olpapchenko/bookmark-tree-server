angular.module("app").controller("editBranchController", ["$scope","branchService", function ($scope, branchService) {
    $scope.branch = $scope.branch || {};
    $scope.header = $scope.isBranch ? "Edit Branch" : "Edit Bookmark";

    $scope.save = function(){
        branchService.persist($scope.branch).then(function(){
            $scope.closeThisDialog();
        });
    }
}]);