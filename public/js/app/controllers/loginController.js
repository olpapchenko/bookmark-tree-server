angular.module("app").controller("loginController",["$scope", "userService","$state", function($scope, userService, $state){
    $scope.submit=function(){
        userService.login($scope.login, $scope.password).then(function(d){
            console.log(d);
            $state.go("app.overview");
        },function(){
           $scope.error = "Username/Password incorrect";
        });
    }
}]);