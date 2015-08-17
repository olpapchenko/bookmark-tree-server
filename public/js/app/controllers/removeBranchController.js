angular.module("app").controller("removeBranchController", ["$scope", "branchService", function($scope, branchService){
    $scope.remove = function(){
        branchService.remove($scope.id).then(function(){
            $scope.closeThisDialog();
            $scope.$state .reload();
        }, function(message){
            //todo add toaster message
        });
    }
}]);