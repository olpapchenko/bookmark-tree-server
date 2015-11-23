angular.module("app").controller("overviewController", [
    "$scope",
    "branchService",
    "editHandler",
    "addBranchDatasource",
    "preferencesService",
    function($scope, branchService, editHandler, addBranchDatasource, preferencesService){
        branchService.all().then(function (data) {
        $scope.entities = data;
    });

    $scope.savePreferedView = function (value) {
        preferencesService.save({key: "overviewListView", value: value});
    }

    $scope.scope = $scope;

    $scope.addBranch = editHandler(addBranchDatasource);
}]);