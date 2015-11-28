angular.module("app").controller("bookmarksController",["$scope",
    "branch",
    "bookmarks",
    "preferencesService",
    "bookmarksDisplayMode",
    function ($scope,
              branch,
              bookmarks,
              preferencesService,
              bookmarksDisplayMode) {
    $scope.entities = bookmarks;
    $scope.branch = branch;
    $scope.isDisplayModeList = bookmarksDisplayMode;
    $scope.scope = $scope;

    $scope.savePreferedView = function (mode) {
        return preferencesService.saveBookmarkListView(mode);
    }
}]);