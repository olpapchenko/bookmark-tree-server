angular.module("app").controller("editBranchController", ["$scope","branchService", "bookmarkService", function ($scope, branchService, bookmarkService) {
    $scope.branch = $scope.branch || {};
    $scope.header = $scope.isBranch ? "Edit Branch" : "Edit Bookmark";
    var persistService = $scope.isBranch ? branchService : bookmarkService;

    $scope.save = function(){
        persistService.persist($scope.branch).then(function(){
            $scope.closeThisDialog();
        });
    }
}]);