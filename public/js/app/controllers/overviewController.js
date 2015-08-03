angular.module("app").controller("overviewController", ["$scope", "branchService", function($scope, branchService){
    branchService.all().then(function (data) {
        $scope.branches = data;
        console.log(data);
    });
}]);