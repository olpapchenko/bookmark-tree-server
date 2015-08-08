angular.module("app").controller("shareController",["$scope","userService","branchService" , "friendsService",function($scope, userService, branchService, friendsService){
    var shareWith = [];

    $scope.userList = friendsService.get();

    $scope.share = function(){

    }

    $scope.addToShare = function(friend) {
        shareWith.push(friend);
    }

    $scope.removeFromShare = function (friend) {
        shareWith.splice(shareWith.indexOf(friend), 1);
    }

    $scope.$watch("name", function(){
        userService.getByName($scope.name).then(function(data){
            $scope.userLilst = data.data;
        });
    });
}]);