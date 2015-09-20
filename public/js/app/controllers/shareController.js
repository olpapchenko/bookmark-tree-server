angular.module("app").controller("shareController",["$scope", "userService", "branchService", "bookmarkService",
    function($scope, userService, branchService, bookmarkService){
    var friendsList;
    $scope.shareWith = [];

    var persistenceService,
        initializeService;

    if($scope.isBranch) {
        persistenceService = branchService;
        initializeService = $scope.datasource.getSharedWithFriendsBranch;
    } else {
        persistenceService = bookmarkService;
        initializeService = $scope.datasource.getSharedWithFriendsBookmark;
    }

    $scope.datasource.all().then(function(data){
        $scope.userList = data;
        friendsList = data;
    });

    initializeService($scope.id).then(function(res){
        res.forEach(function(item){
            $scope.addToShare(item);
        });
    });

    $scope.share = function(){
        persistenceService.share($scope.id, $scope.shareWith.map(function(item){ return item.id;}), $scope.ownership).then(function(){
            $scope.closeThisDialog();
        });
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