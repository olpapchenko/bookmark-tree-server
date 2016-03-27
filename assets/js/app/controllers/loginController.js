var SITE_URL="http://localhost:3000",
    APP_ID = 5038582;
angular.module("app").controller("loginController",["$scope", "userService","$state", "ngProgressFactory", function($scope, userService, $state, ngProgressFactory){

    $scope.submit=function(){
        var progress = ngProgressFactory.createInstance();
        userService.login($scope.login, $scope.password).then(function(d){
            $state.go("app.overview");
            progress.start();
        },function(){
            progress.stop();
           $scope.error = "Username/Password incorrect";

        });
    }
    $scope.vk_login="https://oauth.vk.com/authorize?client_id=" + APP_ID + "&display=page&redirect_uri=" + SITE_URL + "&response_type=token&v=5.37";
}]);