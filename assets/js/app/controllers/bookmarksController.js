define(["angular", "app", "services/preferencesService"], function() {angular.module("app").controller("bookmarksController",["$scope",
    "branch",
    "bookmarks",
    "preferencesService",
    function ($scope,
              branch,
              bookmarks,
              preferencesService
               ) {
    $scope.entities = bookmarks;
    $scope.branch = branch;

    preferencesService.getBookmarkListView().then(function (value) {
        console.log(value);
        $scope.isDisplayModeList = value;
    });
    $scope.scope = $scope;

    $scope.savePreferedView = function (mode) {
        return preferencesService.saveBookmarkListView(mode);
    }
}])});