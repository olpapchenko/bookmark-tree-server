var SITE_URL="http://localhost:3000",
    APP_ID = 5038582,
    GOOGLE_CLIENT_ID = '238683449094-b9flp4812pgjssfo6mn9uoqvniaggi1k.apps.googleusercontent.com';
angular.module("app").controller("loginController",["$scope", "userService","$state", "ngProgressFactory", "$timeout",
    function($scope, userService, $state, ngProgressFactory, $timeout){

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
            progress.stop();
        });
    }

    $scope.vk_login="https://oauth.vk.com/authorize?client_id=" + APP_ID + "&display=page&redirect_uri=" + SITE_URL + "&response_type=token&v=5.37";

    $timeout(function() {
        console.log("triggered");
        console.log(document.getElementById("google-login"));
        gapi.load('auth2', function(){
            console.log("loaded");
            // Retrieve the singleton for the GoogleAuth library and set up the client.
            window.auth2 = window.auth2 ||  gapi.auth2.init({
                client_id: GOOGLE_CLIENT_ID,
                cookiepolicy: 'single_host_origin',
                access_type: 'offline'
            });
            console.log("add handler");
            auth2.attachClickHandler(document.getElementById("google-login"), {},
                function(googleUser) {
                    userService.loginByGoogle({id_token: googleUser.getAuthResponse().id_token})
                    .then(function () {
                        $state.go("app.overview");
                    }, function () {
                        $scope.errors.push("Internal server error");
                    })
                }, function(error) {
                    alert(JSON.stringify(error, undefined, 2));
                });
        });
    });
}]);