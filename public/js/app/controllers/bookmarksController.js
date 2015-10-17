angular.module("app").controller("bookmarksController",["$scope", "bookmarks", function ($scope, bookmarks) {
    $scope.bookmarks = bookmarks;
    console.log("bookmarks " + $scope.bookmarks);
}]);