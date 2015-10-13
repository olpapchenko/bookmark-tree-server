angular.module("app").controller("editBranchController", ["$scope", "$state", function ($scope, $state) {
    $scope.entity = $scope.entity || {};
    $scope.header = $scope.datasource.header;

    var persistService = $scope.datasource.persistService;
    $scope.displayBranchPicker = $scope.datasource.displayBranchPicker;

    $scope.save = function(){
        persistService.persist($scope.entity).then(function(){
            $scope.closeThisDialog();
            $state.reload();
        });
    }
}]);