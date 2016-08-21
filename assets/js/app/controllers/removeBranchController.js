define(["angular", "app", "services/branchService", "services/bookmarkService"], function() {
    angular.module("app").controller("removeBranchController", ["$scope", "branchService", "bookmarkService", function($scope, branchService, bookmarkService){
    $scope.header = $scope.isBranch ? "branch": "bookmark";

    var persistService = $scope.isBranch ? branchService : bookmarkService;

    $scope.remove = function(){
        persistService.remove($scope.id).then(function () {
            $scope.closeThisDialog(true);
        }, function (message) {
            //todo add toaster message
        });
    }
}]);});