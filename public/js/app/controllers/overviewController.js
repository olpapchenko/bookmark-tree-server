angular.module("app").controller("overviewController", ["$scope", "branchService", "ngDialog", function($scope, branchService, ngDialog){
    branchService.all().then(function (data) {
        $scope.branches = data;
        console.log(data);
    });
    $scope.share = function(id){
        $scope.id = id;
        var dialog = ngDialog.open({
            template: '/html/templates/share.html',
            controller: "shareController",
            scope: $scope
        });
    }
}]);