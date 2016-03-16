angular.module("app").factory("editBranchDatasource", ["branchService",  function (branchService) {
    var datasource = {};
    datasource.header = "Edit Branch";
    datasource.displayBranchPicker = false;
    datasource.persistService = branchService;

    return datasource;
}]);