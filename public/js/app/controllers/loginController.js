var SITE_URL="http://localhost:3000",
    APP_ID = 5038582;
angular.module("app").controller("loginController",["$scope", "userService","$state", "ngProgressFactory", function($scope, userService, $state, ngProgressFactory){

    $scope.submit=function(){
        var progress = ngProgressFactory.createInstance();
        progress.start();
        $scope.errors = [];

        userService.login($scope.login, $scope.password).then(function(d){
            $state.go("app.overview");
        },function(){
            $scope.errors.push("Username/Password incorrect");
        }).finally(function () {
            progress.stop();
        });
    }
    $scope.vk_login="https://oauth.vk.com/authorize?client_id=" + APP_ID + "&display=page&redirect_uri=" + SITE_URL + "&response_type=token&v=5.37";
}]);