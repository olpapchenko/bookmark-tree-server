angular.module("app").controller("editBranchController", ["$scope", "$state", function ($scope, $state) {
    var datasource = $scope.datasource;
    var initialEntity = _.clone($scope.entity);

    $scope.entity = $scope.entity || {};
    $scope.header = datasource.header;

    var persistService = datasource.persistService;
    $scope.displayBranchPicker = datasource.displayBranchPicker;

    if($scope.displayBranchPicker) {
         datasource.fetchPickerOptions().then(function (options) {
            $scope.options = options;
            $scope.selected = datasource.initializePickerValue($scope.entity).id;
        });
    }

    $scope.save = function(){
        if(datasource.initializePickerValue($scope.entity).id === $scope.selected && initialEntity.name == $scope.entity.name) {
            $scope.closeThisDialog();
            return;
        }

        persistService.persist($scope.entity).then(function(){
            $scope.closeThisDialog();
            $state.reload();
        });
    }
}]);