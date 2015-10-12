angular.module("app").factory("editBookmarkDatasource", ["bookmarkService",  function (bookmarkService) {
    var datasource = {};
    datasource.header = "Edit Bookmark";
    datasource.displayBranchPicker = true;
    datasource.persistService = bookmarkService;

    return datasource;
}]);