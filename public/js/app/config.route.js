var PAGES_URL = "/html/pages/";

angular.module("app").run(["$rootScope", "$state", "$stateParams", function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    // Credits: Adam's answer in http://stackoverflow.com/a/20786262/69362
// Paste this in browser's console

    $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
        console.log('$stateChangeStart to '+toState.to+'- fired when the transition begins. toState,toParams : \n',toState, toParams);
    });

    $rootScope.$on('$stateChangeError',function(event, toState, toParams, fromState, fromParams){
        console.log('$stateChangeError - fired when an error occurs during transition.');
        console.log(arguments);
    });

    $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){
        console.log('$stateChangeSuccess to '+toState.name+'- fired once the state transition is complete.');
    });

    $rootScope.$on('$viewContentLoaded',function(event){
        console.log('$viewContentLoaded - fired after dom rendered',event);
    });

    $rootScope.$on('$stateNotFound',function(event, unfoundState, fromState, fromParams){
        console.log('$stateNotFound '+unfoundState.to+'  - fired when a state cannot be found by its name.');
        console.log(unfoundState, fromState, fromParams);
    });

}]).config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/overview");
    $stateProvider
        .state("app",{
            abstract: true,
            templateUrl: PAGES_URL + "/app.html",
            controller: "appController",
            resolve:{
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
            templateUrl: "/login",
            controller: "loginController",
            resolve: {
                files: ["$ocLazyLoad", function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        "<%= asset_path('/bundles/js/login.js"
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
                    }, function () {

                    });
                }]}
        })
        .state("logout",{
            controller: "logoutController",
            resolve: {
                files: ["$ocLazyLoad", function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        "/js/app/controllers/logoutController.js"
                    ]);
                }]
            }
        })
        .state("register",{
            url: "/register",
            templateUrl: "/registration",
            controller: "registerController",
            resolve: {
                files: ["$ocLazyLoad", function($ocLazyLoad){
                return $ocLazyLoad.load(["/bundles/js/register.js"]);
            }]}
        })
        .state("app.overview",{
            url: "/overview",
            templateUrl: PAGES_URL + "/overview.html",
            resolve: {
                files:
                ["$ocLazyLoad", function($ocLazyLoad){
                                    return $ocLazyLoad.load(
                                        ["/js/app/datasources/abstractEntityDatasource.js"
                                            ," /js/app/datasources/bookmarkDatasource.js"
                                            ," /js/app/datasources/branchDatasource.js"
                                            ," /js/app/datasources/editBranchDatasource.js"
                                            ," /js/app/datasources/addBranchDatasource.js"

                                            ," /js/app/controllers/overviewController.js"
                                            ," /js/vendor/jquery-backstretch/jquery.backstretch.js"
                                            ," /js/app/services/branchService.js"

                                            ," /js/app/controllers/shareController.js"
                                            ," /js/app/services/friendsService.js"
                                            ," /js/app/controllers/editBranchController.js"

                                            ," /js/app/controllers/removeBranchController.js"
                                            ," /js/app/services/bookmarkService.js"
                                            ," /js/app/services/preferencesService.js"
                                            ," /js/app/datasources/editBookmarkDatasource.js"

                                            ," /js/app/services/editHandler.js"
                                            ," /js/app/datasources/shareDatasourceAbstract.js"

                                            ," /js/app/datasources/shareDatasourceAllBookmark.js"
                                            ," /js/app/datasources/shareDatasourceAllBranch.js"

                                            ," /js/app/services/shareHandler.js"
                                            ," /js/app/services/removeHandler.js"

                                            ," /js/app/directives/branchBookmarkList.js"
                                            ," /js/app/directives/branchBookmarkPanel.js"
                                            ," /js/app/directives/switchableView.js"
                                            ," /js/app/directives/addEntityButton.js"
                                    ]);
                    }
                ],
                preferedView: ["$ocLazyLoad", "$injector", function ($ocLazyLoad, $injector) {
                    return $ocLazyLoad.load("/js/app/services/preferencesService.js").then(function () {
                        var preferencesService = $injector.get("preferencesService");
                        return preferencesService.getOverviewListView();
                    });
               }],
                branches: ["$ocLazyLoad", "$injector", function ($ocLazyLoad, $injector) {
                    return $ocLazyLoad.load("/js/app/services/branchService.js").then(function () {
                        var branchService = $injector.get("branchService");
                        return branchService.all();
                    })
                }]
            },
            controller: "overviewController"
        })
        .state("app.shared", {
            url: "/shared",
            templateUrl: PAGES_URL + "/shared.html",
            resolve: {
                files: ["$ocLazyLoad", function($ocLazyLoad){
                    return $ocLazyLoad.load(["/js/app/controllers/sharedController.js"]);
                }]
            },
            controller: "sharedController"
        })
        .state("app.user", {
            url: "/user/:id",
            templateUrl: PAGES_URL + "/user.html",
            resolve: {
                files: ["$ocLazyLoad", function($ocLazyLoad){
                    return $ocLazyLoad.load(["/bundles/js/user.js"]);
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
            resolve: {
                files: ["$ocLazyLoad", function($ocLazyLoad){
                    return $ocLazyLoad.load(["/bundles/js/profile.js"]);
                }]
            },
            controller: "profileController"
        })
        //.state("app.plan", {
        //    url: "/plan",
        //    templateUrl: PAGES_URL + "/plan.html",
        //    resolve: ["$ocLazyLoad", function($ocLazyLoad){
        //        return $ocLazyLoad.load([
        //            "/js/app/controllers/planController.js"]);
        //    }],
        //    controller: "planController"
        //})
        .state("app.friends", {
            url: "/friends",
            templateUrl: PAGES_URL + "/friends.html",
            resolve: {
                files: ["$ocLazyLoad", function($ocLazyLoad){
                    return $ocLazyLoad.load(["/bundles/js/friends.js"]);
                }],
                friends: ["$ocLazyLoad", "$injector", function($ocLazyLoad, $injector){
                    return $ocLazyLoad.load("/js/app/services/preferencesService.js").then(function () {
                        var friendsService = $injector.get("friendsService");
                        return friendsService.all();
                    })
                }],
                isFriendsBranchesDisplayModeList: ["$ocLazyLoad", "$injector", function ($ocLazyLoad, $injector) {
                    return $ocLazyLoad.load("/js/app/services/preferencesService.js").then(function () {
                        var preferencesService = $injector.get("preferencesService");
                        return preferencesService.getFriendsBranchListView();
                    })
                }],
                isFriendsBookmarksDisplayModeList: ["$ocLazyLoad", "$injector", function ($ocLazyLoad, $injector) {
                    return $ocLazyLoad.load("/js/app/services/preferencesService.js").then(function () {
                        var preferencesService = $injector.get("preferencesService");
                        return preferencesService.getFriendsBookmarkListView();
                    })
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
                bookmarks: [ "$ocLazyLoad", "$stateParams", "$injector",  function($ocLazyLoad, $stateParams, $injector){
                     return $ocLazyLoad.load(["/js/app/services/bookmarkService.js"]).then(function () {
                         var bookmarkService = $injector.get("bookmarkService");
                         return bookmarkService.allByBranch($stateParams.id);
                     })
                }],
                branch: ["$ocLazyLoad", "$stateParams", "$injector", function ($ocLazyLoad, $stateParams, $injector) {
                    return $ocLazyLoad.load(["/js/app/services/branchService.js"]).then(function () {
                        var branchService = $injector.get("branchService");
                        return branchService.get($stateParams.id);
                    })
                }],
                bookmarksDisplayMode: ["$ocLazyLoad", "$injector", function ($ocLazyLoad, $injector) {
                    return $ocLazyLoad.load("/js/app/services/preferencesService.js").then(function () {
                        var preferencesService = $injector.get("preferencesService");
                        return preferencesService.getBookmarkListView();
                    })
                }]
            },
            controller: "bookmarksController"
        })
        .state("app.notifications", {
            url: "/notifications",
            templateUrl: PAGES_URL + "notifications.html",
            resolve: {
                files: ["$ocLazyLoad", function($ocLazyLoad){
                    return $ocLazyLoad.load(["/bundles/js/notifications.js"]);
                }],
                notifications: ["$ocLazyLoad", "$injector", function ($ocLazyLoad, $injector) {
                    return $ocLazyLoad.load("/js/app/services/notificationService.js").then(function () {
                        var notificationsService = $injector.get("notificationService");
                        return notificationsService.all();
                    })
                }]
            },
            controller: "notificationsController"
        })
}]);