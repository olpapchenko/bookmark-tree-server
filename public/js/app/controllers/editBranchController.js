angular.module("app").controller("editBranchController", ["$scope", "$state", function ($scope, $state) {
    var datasource = $scope.datasource;

    $scope.entity = $scope.entity || {};
    $scope.header = datasource.header;

    var persistService = datasource.persistService;
    $scope.displayBranchPicker = datasource.displayBranchPicker;

    if($scope.displayBranchPicker) {
         datasource.fetchPickerOptions().then(function (options) {
            $scope.options = options;
        });
    }

    $scope.save = function(){
        console.log($scope.selected);
        persistService.persist($scope.entity).then(function(){
            $scope.closeThisDialog();
            $state.reload();
        });
    }
}]);