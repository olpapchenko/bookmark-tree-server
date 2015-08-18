var PAGES_URL = "/html/pages/";

angular.module("app").run(["$rootScope", "$state", "$stateParams", function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
}]).config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/overview");
    $stateProvider
        .state("app",{
            abstract: true,
            templateUrl: PAGES_URL + "/app.html",
            controller: "appController",
            resolve:{
                files: ["$ocLazyLoad", "$injector",
                    function($ocLazyLoad){
                        return $ocLazyLoad.load(["/js/app/controllers/appController.js"])
                    }],
                user: ["$ocLazyLoad", "$injector", "$rootScope", "$state", function ($ocLazyLoad, $injector, $rootScope, $state) {
                    return $ocLazyLoad.load(["/js/app/services/userService.js", "/js/app/services/notificationService.js"]).then(function(){
                        var userService = $injector.get("userService");
                        return userService.getUser();
                    }).then(function(user){
                        $rootScope.user = user;
                    },  function( ){
                        $state.go("login");
                    });
                }]
            }
        })
        .state("login",{
            url: "/login",
            templateUrl: PAGES_URL + "/login.html",
            controller: "loginController",
            resolve: ["$ocLazyLoad", function($ocLazyLoad){
                return $ocLazyLoad.load([
                    "/js/app/controllers/loginController.js",
                    "/js/app/services/userService.js"
                ]);
            }]
        })
        .state("register",{
            url: "/register",
            templateUrl: PAGES_URL + "/register.html",
            controller: "registerController",
            resolve: ["$ocLazyLoad", function($ocLazyLoad){
                return $ocLazyLoad.load(["/js/app/controllers/registrationController.js"]);
            }]
        })
        .state("app.overview",{
            url: "/overview",
            templateUrl: PAGES_URL + "/overview.html",
            resolve: ["$ocLazyLoad", function($ocLazyLoad){
                return $ocLazyLoad.load(["/js/app/controllers/overviewController.js",
                                         "/js/vendor/jquery.backstretch.min.js",
                                         "/js/app/services/branchService.js",
                                         "/js/app/controllers/shareController.js",
                                         "/js/app/services/friendsService.js",
                                         "/js/app/controllers/editBranchController.js",
                                         "/js/app/controllers/removeBranchController.js",
                                         {type: 'css', path: '/css/vendor/five.css'}]);
            }],
            controller: "overviewController"
        })
        .state("app.shared", {
            url: "/shared",
            templateUrl: PAGES_URL + "/shared.html",
            resolve: ["$ocLazyLoad", function($ocLazyLoad){
                return $ocLazyLoad.load(["/js/app/controllers/sharedController.js"]);
            }],
            controller: "sharedController"
        })
        .state("app.profile", {
            url: "/profile",
            templateUrl: PAGES_URL + "/profile.html",
            resolve: ["$ocLazyLoad", function($ocLazyLoad){
                return $ocLazyLoad.load(["/js/app/controllers/profileController.js"]);
            }],
            controller: "profileController"
        })
        .state("app.friends", {
            url: "/friends",
            templateUrl: PAGES_URL + "/friends.html",
            resolve: {
                files: ["$ocLazyLoad", function($ocLazyLoad){
                return $ocLazyLoad.load(["/js/app/controllers/friendsController.js",
                                         "/js/app/services/friendsService.js",
                                         "/js/app/controllers/removeFriendController.js"]);
                }],
                friends: ["friendsService", function(friendsService){
                    return friendsService.all();
                }]
            },
            controller: "friendsController"
        })
}]);



