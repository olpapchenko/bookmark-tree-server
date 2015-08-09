angular.module("app").controller("shareController",["$scope","userService","branchService" , "friendsService",function($scope, userService, branchService, friendsService){
    var friendsList;
    $scope.shareWith = [];

    friendsService.get().then(function(data){
        $scope.userList = data;
        friendsList = data;
    });

    $scope.share = function(){
        branchService.share($scope.id, $scope.shareWith);
    }

    $scope.addToShare = function(friend) {
        if( !($scope.shareWith.some(function(item){ return item.id == friend.id}))){
            $scope.shareWith.push(friend);
        }
    }

    $scope.removeFromShare = function (friend) {
        $scope.shareWith.splice($scope.shareWith.indexOf(friend), 1);
    }

    $scope.$watch("name", function(){
        if($scope.name != undefined && $scope.name.length == 0) {
            $scope.userList = friendsList;
        }
        if(!$scope.name || $scope.name.length < 3){
            return;
        }
        userService.getByName($scope.name).then(function(data){
            $scope.userList = data;
        });
    });
}]);