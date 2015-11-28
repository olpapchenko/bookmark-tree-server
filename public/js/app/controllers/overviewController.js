angular.module("app").controller("overviewController", [
    "$scope",
    "branchService",
    "editHandler",
    "addBranchDatasource",
    "preferencesService",
    "preferedView",
    function($scope, branchService, editHandler, addBranchDatasource, preferencesService, preferedView){
        branchService.all().then(function (data) {
        $scope.entities = data;
    });

    $scope.isDisplayModeList = preferedView;

    $scope.savePreferedView = function (value) {
        preferencesService.saveOverviewListView(value);
    }

    $scope.scope = $scope;

    $scope.addBranch = editHandler(addBranchDatasource);
}]);