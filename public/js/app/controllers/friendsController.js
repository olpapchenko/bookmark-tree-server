angular.module("app").controller("friendsController", ["friends","$scope","userService", "friendsService", function(friends, $scope, userService, friendsService){
    $scope.friends = friends;

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
    };

    $scope.removeFriend = function(id) {
        friendsService.removeFriend(id).then(function(){
            $scope.$state.reload();
        });
    }
}]);