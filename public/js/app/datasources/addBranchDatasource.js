angular.module("app").factory("addBranchDatasource", ["editBranchDatasource",  function (editBranchDatasource) {
    editBranchDatasource.header = "Add branch"
    return editBranchDatasource;
}]);