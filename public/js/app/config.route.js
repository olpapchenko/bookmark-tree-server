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
                        return $ocLazyLoad.load([
                                                "/js/app/services/avatarService.js",
                                                "/js/app/controllers/appController.js",
                                                "/js/app/directives/notification.js"])
                    }],
                currentUser: ["$ocLazyLoad", "$injector", "$rootScope", "$state", function ($ocLazyLoad, $injector, $rootScope, $state) {
                    return $ocLazyLoad.load(["/js/app/services/userService.js", "/js/app/services/notificationService.js"]).then(function(){
                        var userService = $injector.get("userService");
                        return userService.getCurrentUser();
                    }).then(function(user){
                        $rootScope.currentUser = user;
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
            resolve: {
                files: ["$ocLazyLoad", function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        "/js/app/controllers/loginController.js",
                        "/js/app/services/userService.js"
                    ]);
                }],
                currentUser: ["$ocLazyLoad", "$injector", "$rootScope", "$state", function ($ocLazyLoad, $injector, $rootScope, $state) {
                    return $ocLazyLoad.load(["/js/app/services/userService.js", "/js/app/services/notificationService.js"]).then(function(){
                        var userService = $injector.get("userService");
                        return userService.getCurrentUser();
                    }).then(function(user){
                        if(user) {
                            $state.go("app.overview");
                        }
                    });
                }]}
        })
        .state("logout",{
            controller: "logoutController",
            resolve: ["$ocLazyLoad", function($ocLazyLoad){
                return $ocLazyLoad.load([
                    "/js/app/controllers/logoutController.js"
                ]);
            }]
        })
        .state("register",{
            url: "/register",
            templateUrl: PAGES_URL + "/register.html",
            controller: "registerController",
            resolve: ["$ocLazyLoad", function($ocLazyLoad){
                return $ocLazyLoad.load(["/js/app/services/userService.js",
                                         "/js/app/controllers/registrationController.js"]);
            }]
        })
        .state("app.overview",{
            url: "/overview",
            templateUrl: PAGES_URL + "/overview.html",
            resolve: ["$ocLazyLoad", function($ocLazyLoad){
            return $ocLazyLoad.load([
                                         "/js/app/datasources/abstractEntityDatasource.js",
                                         "/js/app/datasources/bookmarkDatasource.js",
                                         "/js/app/datasources/branchDatasource.js",
                                         "/js/app/datasources/editBranchDatasource.js",
                                         "/js/app/datasources/addBranchDatasource.js",
                                         "/js/app/controllers/overviewController.js",
                                         "/js/vendor/jquery.backstretch.min.js",
                                         "/js/app/services/branchService.js",
                                         "/js/app/controllers/shareController.js",
                                         "/js/app/services/friendsService.js",
                                         "/js/app/controllers/editBranchController.js",
                                         "/js/app/controllers/removeBranchController.js",
                                         "/js/app/services/bookmarkService.js",
                                         "/js/app/datasources/editBookmarkDatasource.js",
                                         "/js/app/services/editHandler.js",
                                         "/js/app/datasources/shareDatasourceAbstract.js",
                                         "/js/app/datasources/shareDataSourceAllBookmark.js",
                                         "/js/app/datasources/shareDataSourceAllBranch.js",
                                         "/js/app/services/shareHandler.js",
                                         "/js/app/directives/branchBookmarkPanel.js"]);
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
        .state("app.user", {
            url: "/user/:id",
            templateUrl: PAGES_URL + "/user.html",
            resolve: {
                files: ["$ocLazyLoad", function($ocLazyLoad){
                    return $ocLazyLoad.load(["/js/app/controllers/userController.js",
                                             "js/app/services/avatarService.js",
                                             "js/app/services/userService.js"]);
                }],
                user: ["userService", "$stateParams", function (userService, $stateParams) {
                    return userService.get($stateParams.id);
                }]
            },
            controller: "userController"
        })
        .state("app.profile", {
            url: "/profile",
            templateUrl: PAGES_URL + "/profile.html",
            resolve: ["$ocLazyLoad", function($ocLazyLoad){
                return $ocLazyLoad.load([
                                        "js/app/services/avatarService.js",
                                        "/js/app/controllers/profileController.js"]);
            }],
            controller: "profileController"
        })
        .state("app.friends", {
            url: "/friends",
            templateUrl: PAGES_URL + "/friends.html",
            resolve: {
                files: ["$ocLazyLoad", function($ocLazyLoad){
                return $ocLazyLoad.load(["/js/app/services/avatarService.js",
                                         "/js/app/controllers/friendsController.js",
                                         "/js/app/services/friendsService.js",
                                         "/js/app/controllers/removeFriendController.js",
                                         "/js/app/directives/branchBookmarkPanel.js",
                                         "/js/app/datasources/editBookmarkDatasource.js",
                                         "/js/app/datasources/editBranchDatasource.js",
                                         "/js/app/services/editHandler.js",
                                         "/js/app/services/bookmarkService.js",
                                         "/js/app/services/branchService.js",
                                         "/js/app/datasources/shareDatasourceAbstract.js",
                                         "/js/app/datasources/shareDataSourceAllBookmark.js",
                                         "/js/app/datasources/shareDataSourceAllBranch.js",
                                         "/js/app/services/shareHandler.js"]);
                }],
                friends: ["friendsService", function(friendsService){
                    return friendsService.all();
                }]
            },
            controller: "friendsController"
        })
        .state("app.branch", {
            url: "/branch/:id/:name",
            templateUrl: PAGES_URL + "bookmarks.html",
            resolve: {
                files: ["$ocLazyLoad", function($ocLazyLoad){
                    return $ocLazyLoad.load(["/js/app/controllers/bookmarksController.js"]);
                }],
                bookmarks: ["bookmarkService", "$stateParams", function(bookmarkService, $stateParams){
                     return bookmarkService.allByBranch($stateParams.id);
                }],
                branch: ["branchService", "$stateParams", function (branchService, $stateParams) {
                    return branchService.get($stateParams.id);
                }]
            },
            controller: "bookmarksController"
        })
        .state("app.notifications", {
            url: "/notifications",
            templateUrl: PAGES_URL + "notifications.html",
            resolve: {
                files: ["$ocLazyLoad", function($ocLazyLoad){
                    return $ocLazyLoad.load(["/js/app/controllers/notificationsController.js",
                                             "/js/app/services/notificationService.js"]);
                }],
                notifications: ["notificationService", function (notificationsService) {
                    return notificationsService.all();
                }]
            },
            controller: "notificationsController"
        })
}]);



