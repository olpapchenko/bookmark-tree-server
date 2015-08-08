angular.module("app").controller("shareController",["$scope","userService","branchService" , "friendsService",function($scope, userService, branchService, friendsService){
    $scope.shareWith = [];

    friendsService.get().then(function(data){
        $scope.userList = data;
    });

    $scope.share = function(){

    }

    $scope.addToShare = function(friend) {
        if($scope.shareWith.indexOf(friend) == -1){
            $scope.shareWith.push(friend);
        }
    }

    $scope.removeFromShare = function (friend) {
        $scope.shareWith.splice($scope.shareWith.indexOf(friend), 1);
    }

    $scope.$watch("name", function(){
        if($scope.name && $scope.name.length == 0) {
            friendsService.get().then(function(data){
                $scope.userList = data;
            });
        }
        if(!$scope.name || $scope.name.length < 3){
            return;
        }
        userService.getByName($scope.name).then(function(data){
            $scope.userList = data;
        });
    });
}]);