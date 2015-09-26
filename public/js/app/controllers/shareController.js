angular.module("app").controller("shareController",["$scope",
    function($scope){
    var friendsList,
        persistanceService = $scope.datasource.persistanceService;

    $scope.shareWith = [];

    persistanceService.getShareInformation($scope.id).then(function(data){
        $scope.owners = data.owners;
        $scope.observers = data.observers;
    });

    $scope.datasource.friends.all().then(function(data){
        $scope.userList = data;
        friendsList = data;
    });

    $scope.share = function(){
        persistenceService.share($scope.id, $scope.shareWith.map(function(item){ return item.id;}), $scope.ownership).then(function(){
            $scope.closeThisDialog();
        });
    }

    $scope.removeFromOwnerShip = function (friend) {
        $scope.owners.splice($scope.owners.indexOf(friend), 1);
    }

    $scope.removeFromObservers = function (friend) {
        $scope.observers.splice($scope.observers.indexOf(friend), 1);
    }

    $scope.$watch("name", function(){
        if($scope.name != undefined && $scope.name.length == 0) {
            $scope.userList = friendsList;
        }
        if(!$scope.name || $scope.name.length < 3){
            return;
        }
        datasource.users.getByName($scope.name).then(function(data){
            $scope.userList = data;
        });
    });
}]);