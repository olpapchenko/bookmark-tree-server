angular.module("app").controller("friendsController", ["$scope","userService", "friendsService", function($scope, userService, friendsService){
    $scope.$watch("userName", function(){
        if(!$scope.userName || $scope.userName.length < 3){
            $scope.userList=[];
            return;
        }
        userService.getByName($scope.userName).then(function(data){
            $scope.userList = data;
        });
    });

    $scope.addToFriends = function(id) {
        friendsService.addFriend(id).then(function(){
            $scope.$state.reload();
        });
    }
}]);