angular.module("app").controller("bookmarksController",["$scope", "branch", "bookmarks", function ($scope, branch, bookmarks) {
    $scope.bookmarks = bookmarks;
    $scope.branch = branch;
}]);