angular.module("app").controller("editBranchController", ["$scope", "$state", "toaster", function ($scope, $state, toaster) {
    var datasource = $scope.datasource;
    var initialEntity = angular.copy($scope.entity);

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

        if($scope.nameForm.name.$invalid) {
            return;
        }

        if(initialEntity && initialEntity.name == $scope.entity.name && (datasource.initializePickerValue == null || datasource.initializePickerValue($scope.entity).id === $scope.selected)) {
            $scope.closeThisDialog();
            return;
        }

        if(datasource.displayBranchPicker){
            datasource.setPickedValue($scope.entity, $scope.selected);
        }

        persistService.persist($scope.entity).then(function(){
            $scope.closeThisDialog();
            toaster.pop('success', "Saved!", "");
            $state.reload();
        }, function() {
            $scope.entity.name = initialEntity.name;
            toaster.pop('error', "Save error", "Something went wrong!");
            $scope.closeThisDialog();
        });
    }
}]);