define(["angular","app", "services/bookmarkService", "services/branchService"], function() {
    angular.module("app").factory("editBookmarkDatasource", ["bookmarkService", "branchService", function (bookmarkService, branchService) {
    var datasource = {};
    datasource.header = "Edit Bookmark";
    datasource.displayBranchPicker = true;
    datasource.persistService = bookmarkService;
    datasource.fetchPickerOptions = branchService.all;
    datasource.setPickedValue = function (entity, picked) {
        entity.branch_id = picked;
    }

    datasource.initializePickerValue = function (entity) {
        return entity.branch;
    }

    return datasource;
}]);});