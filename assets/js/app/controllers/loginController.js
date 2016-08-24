define(["angular", "app", "services/userService", "services/fbService", "ngProgress"], function() {var SITE_URL="http://localhost:3000",
    APP_ID = 5038582,
    GOOGLE_CLIENT_ID = '238683449094-b9flp4812pgjssfo6mn9uoqvniaggi1k.apps.googleusercontent.com';
    FB_APP_ID = 1658456254475560,

    ORIGINS = {
        bookmarkTree: 1,
        google: 2,
        faceBook: 3,
        vkontakte: 4
    };

angular.module("app").controller("loginController",["$scope", "userService","$state", "ngProgressFactory", "$timeout", "fbService",
    function($scope, userService, $state, ngProgressFactory, $timeout, fbService){

    $scope.errors = [];

    $scope.submit=function(){
        var progress = ngProgressFactory.createInstance();

        if($scope.origins == ORIGINS.faceBook) {
            progress.start();
            return userService.loginByFacebook({access_token: $scope.accessToken, user: {mail: $scope.login, name: $scope.name}})
            .then(function (response) {
                if(response.mailNotVerified) {
                    $scope.showMailVerificationMessage = true;
                } else {
                    $state.go("app.overview");
                }

            }, function () {
                $scope.errors.push("Error occurred while performing log in");
            }).finally(function () {
                progress.complete();
            });
        }

        progress.start();
        $scope.errors = [];

        userService.login($scope.login, $scope.password).then(function(d){
            $state.go("app.overview");
        },function(){
            $scope.errors.push("Username/Password incorrect");
        }).finally(function () {
            progress.complete();
            progress.complete();
        });
    }

    $scope.changeUser = function () {
        fbService.logout().then(function () {
            $state.reload();
        });
    }

    $scope.vk_login="https://oauth.vk.com/authorize?client_id=" + APP_ID + "&display=page&redirect_uri=" + SITE_URL + "&response_type=token&v=5.37";


    //setup google auth
    $timeout(function() {
        gapi.load('auth2', function(){
            // Retrieve the singleton for the GoogleAuth library and set up the client.
            window.auth2 = window.auth2 ||  gapi.auth2.init({
                client_id: GOOGLE_CLIENT_ID,
                cookiepolicy: 'single_host_origin',
                access_type: 'offline'
            });
            auth2.attachClickHandler(document.getElementById("google-login"), {},
                function(googleUser) {
                    userService.loginByGoogle({id_token: googleUser.getAuthResponse().id_token})
                    .then(function () {
                        $state.go("app.overview");
                    }, function () {
                        $scope.errors.push("Internal server error");
                    })
                }, function(error) {
                    console.log("failed to attach handler");
                    console.error(error);
                });
        });
    });

    function processFBLogin(token) {
        FB.api('/me?fields=name,email', function (response) {
            $scope.$apply(function () {
                if (response.email) {
                    return userService.loginByFaceBook({
                        access_token: token,
                        user: {mail: response.email, name: $scope.name}
                    })
                        .then(function (response) {
                            if (response.mailNotverified) {
                                $scope.showMailVerificationMessage = true;
                            } else {
                                $state.go("app.overview");
                            }
                        });
                } else {
                    $scope.facebookId = response.id;
                    $scope.origins = ORIGINS.faceBook;
                    $scope.accessToken = token;
                    $scope.showMailOnly = true;
                    $scope.name = response.name;
                    $scope.errors.push("Please enter email address and press Sign in to continue login");
                }
            });
        });
    }


    fbService.getLoginStatus().then(function (response) {
        if(response.status == "connected") {
            processFBLogin(response.authResponse.accessToken);
        }
    });


    $scope.fbLogin = function () {
        fbService.login().then(function (response) {
            if(response.authResponse) {
                processFBLogin(response.authResponse.accessToken);
            }
        });
    }
}]);});