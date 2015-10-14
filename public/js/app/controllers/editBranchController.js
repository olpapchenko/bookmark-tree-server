angular.module("app").controller("editBranchController", ["$scope", "$state", "toaster", function ($scope, $state, toaster) {
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
        if(initialEntity && initialEntity.name == $scope.entity.name && (datasource.initializePickerValue == null || datasource.initializePickerValue($scope.entity).id === $scope.selected)) {
            $scope.closeThisDialog();
            return;
        }

        if(datasource.displayBranchPicker){
            datasource.setPickedValue($scope.entity, $scope.selected);
        }

        persistService.persist($scope.entity).then(function(){
            $scope.closeThisDialog();
            $state.reload();
        }, function() {
            toaster.pop('error', "Save error", "You are not the owner!");
            $scope.closeThisDialog();
        });
    }
}]);