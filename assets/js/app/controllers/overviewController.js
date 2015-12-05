angular.module("app").controller("overviewController", [
    "$scope",
    "branchService",
    "editHandler",
    "addBranchDatasource",
    "preferencesService",
    "preferedView",
    "branches",
    function($scope, branchService, editHandler, addBranchDatasource, preferencesService, preferedView, branches) {
        $scope.entities = branches;
        $scope.isDisplayModeList = preferedView;
        $scope.scope = $scope;
        $scope.addBranch = editHandler(addBranchDatasource);

        $scope.savePreferedView = function (value) {
            preferencesService.saveOverviewListView(value);
        }
}]);