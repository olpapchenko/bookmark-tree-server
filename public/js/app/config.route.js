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
            resolve: []
        })
        .state("login",{
            url: "/login",
            templateUrl: PAGES_URL + "/login.html",
            controller: "loginController",
            resolve: ["$ocLazyLoad", function($ocLazyLoad){
                return $ocLazyLoad.load([
                "/js/app/controllers/loginController.js",

                "/js/vendor/jquery-1.11.1.min.js",
                "/js/vendor/bootstrap/bootstrap.min.js",
                "/js/vendor/jquery.backstretch.min.js",
                "/js/vendor/scripts.js",
                "js/vendor/placeholder.js",
                "/js/app/services/userService.js"]);
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
                return $ocLazyLoad.load(["/js/app/controllers/overviewController.js"]);
            }],
            controller: "overviewController"
        })
        .state("app.branch", {
            url: "/branch/:id",
            templateUrl: PAGES_URL + "/branch.html",
            resolve: ["$ocLazyLoad", function($ocLazyLoad){
                return $ocLazyLoad.load(["/js/app/controllers/branchController.js"]);
            }],
            controller: "branchController"
        })
}]);



