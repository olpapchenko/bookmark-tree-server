var SITE_URL="http://localhost:3000",
    APP_ID = 5038582;
angular.module("app").controller("loginController",["$scope", "userService","$state", function($scope, userService, $state){
    $scope.submit=function(){
        userService.login($scope.login, $scope.password).then(function(d){
            console.log(d);
            $state.go("app.overview");
        },function(){
           $scope.error = "Username/Password incorrect";
        });
    }
    $scope.vk_login="https://oauth.vk.com/authorize?client_id=" + APP_ID + "&display=page&redirect_uri=" + SITE_URL + "&response_type=token&v=5.37";
}]);