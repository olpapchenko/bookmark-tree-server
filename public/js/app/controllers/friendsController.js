angular.module("app").controller("friendsController", ["friends","$scope","userService", "friendsService","ngDialog", "avatarService",
    function(friends, $scope, userService, friendsService, ngDialog, avatarService){
    $scope.friends = friends;
    $scope.avatarService = avatarService;

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
        $scope.id = id;
        var dialog = ngDialog.open({
            template: '/html/templates/removeBranch.html',
            controller: "removeFriendController",
            scope: $scope
        });
    }

    $scope.loadDetails = function (index) {
        friends[index].showDetails = !friends[index].showDetails;
        if(!friends[index].showDetails) {
            return;
        }
        friendsService.getSharedEntities(friends[index].id).then(function(sharedEntitiesData){
            friends[index].sharedEntitiesData = sharedEntitiesData;
        });
    }
}]);