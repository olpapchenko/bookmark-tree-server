angular.module("app").service("shareDatasourceAbsarct", ["friendsService", function (friendsService){

    this.all = friendsService.all;

}]);