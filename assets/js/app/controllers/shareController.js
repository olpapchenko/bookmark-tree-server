define(["angular", "underscore", "app", "services/avatarService"], function() {
    angular.module("app").controller("shareController",["$scope", "avatarService",
    function($scope, avatarService){
    var friendsList,
        persistanceService = $scope.datasource.persistanceService;

    var removedUsers = [];

    $scope.avatarService = avatarService;

    persistanceService.get($scope.id).then(function (entity) {
        var encodedEntityUrl = encodeURIComponent(entity.url);
        $scope.fbShareLink = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(entity.url);
        $scope.vkShare = "https://vk.com/share.php?url=" + encodeURIComponent(entity.url);
        $scope.googleShare = "https://plus.google.com/share?url=" + encodedEntityUrl;
        $scope.showShare = entity.url;
        $scope.isPublic = entity.is_public;
    });

    persistanceService.getShareInformation($scope.id).then(function(data){
        $scope.owners = data.owners;
        $scope.observers = data.observers;
    });

    $scope.datasource.friends.all().then(function(data){
        $scope.userList = data;
        friendsList = data;
    });

    $scope.addToShare = function (user) {
        var ownersObservers = $scope.owners.concat($scope.observers);
        if(!(ownersObservers.some(function(item){return item.id === user.id;}))) {
            $scope.observers.push(user);
        }
        var idx  = _.findIndex(removedUsers, function (curUser) { return user.id == curUser.id});
        if(idx !== -1) {
            removedUsers.splice(idx,1);
        }
    }

    $scope.share = function(){
        var ownerIds = $scope.owners.map(function(user) {return user.id}),
            observerIds = $scope.observers.map(function(user){return user.id});
            removedUserIds = removedUsers.map(function (user) {return user.id});

        persistanceService.share({id: $scope.id, owners: ownerIds, observers: observerIds, removed: removedUserIds, isPublic: $scope.isPublic}).then(function(){
            $scope.closeThisDialog();
        });
    }

    $scope.removeFromOwnerShip = function (friend) {
        $scope.owners.splice($scope.owners.indexOf(friend), 1);
        removedUsers.push(friend);
    }

    $scope.removeFromObservers = function (friend) {
        $scope.observers.splice($scope.observers.indexOf(friend), 1);
        removedUsers.push(friend);
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
}]);});