angular.module("app").factory("editBookmarkDatasource", ["bookmarkService", "branchService", function (bookmarkService, branchService) {
    var datasource = {};
    datasource.header = "Edit Bookmark";
    datasource.displayBranchPicker = true;
    datasource.persistService = bookmarkService;
    datasource.fetchPickerOptions = branchService.all;

    return datasource;
}]);