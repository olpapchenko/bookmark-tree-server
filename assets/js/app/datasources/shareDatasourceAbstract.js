define(["angular","app", "services/userService", "services/friendsService"], function() {
    angular.module("app").service("shareDatasourceAbstract", ["friendsService", "userService",  function (friendsService, userService){

    this.friends = friendsService;
    this.usersService = userService;

}]);});