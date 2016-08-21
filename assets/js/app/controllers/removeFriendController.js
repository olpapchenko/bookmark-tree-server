define(["angular", "app", "services/friendsService"], function() {
    angular.module("app").controller("removeFriendController", ["$scope", "friendsService", function($scope, friendsService){
    $scope.entity = "friend";

    $scope.remove = function(){
        friendsService.removeFriend($scope.id).then(function(){
            $scope.closeThisDialog();
            $scope.$state .reload();
        }, function(message){
            //todo add toaster message
        });
    }
}]);});