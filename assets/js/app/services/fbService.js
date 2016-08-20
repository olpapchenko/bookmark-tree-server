angular.module("app").service("fbService", ["$q", function ($q) {
    var FB_APP_ID = 1658456254475560;

    this.getLoginStatus = function () {
        setupFB();
        return $q(function (resolve, reject) {
            FB.getLoginStatus(function (response) {
                resolve(response);
            });
        });
    };

    this.login = function () {
        setupFB();
        return $q(function (resolve, reject) {
            FB.login(function (response) {
                resolve(response);
            });
        });
    }

    this.logout = function () {
        setupFB();
        return this.getLoginStatus().then(function (response) {
            if(response.status != "connected") {
                return;
            }

            return $q(function (resolve, reject) {
                FB.logout(function (response) {
                    resolve(response);
                });
            });
        });
    }

    function setupFB() {
        //setup facebook auth
        FB.init({
            appId      : FB_APP_ID,
            cookie     : true,  // enable cookies to allow the server to access
                                // the session
            xfbml      : true,  // parse social plugins on this page
            version    : 'v2.2' // use version 2.2
        });
    }
}]);