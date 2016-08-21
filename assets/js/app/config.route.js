var PAGES_URL = "/html/pages/";

require(["angular",
        "angular-ui-router",
        "app",
        "controllers/all",
        "services/all",
        "directives/all",
        "bootstrap"
], function() {
    angular.module("app").run(["$rootScope", "$state", "$stateParams", function ($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
//
//        // Credits: Adam's answer in http://stackoverflow.com/a/20786262/69362
//// Paste this in browser's console
//
//        //$rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
//        //    console.log('$stateChangeStart to '+toState.to+'- fired when the transition begins. toState,toParams : \n',toState, toParams);
//        //});
//        //
//        //$rootScope.$on('$stateChangeError',function(event, toState, toParams, fromState, fromParams){
//        //    console.log('$stateChangeError - fired when an error occurs during transition.');
//        //    console.log(arguments);
//        //});
//        //
//        //$rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){
//        //    console.log('$stateChangeSuccess to '+toState.name+'- fired once the state transition is complete.');
//        //});
//        //
//        //$rootScope.$on('$viewContentLoaded',function(event){
//        //    console.log('$viewContentLoaded - fired after dom rendered',event);
//        //});
//        //
//        //$rootScope.$on('$stateNotFound',function(event, unfoundState, fromState, fromParams){
//        //    console.log('$stateNotFound '+unfoundState.to+'  - fired when a state cannot be found by its name.');
//        //    console.log(unfoundState, fromState, fromParams);
//        //});

    }]).config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/overview");
        $stateProvider
            .state("app",{
                abstract: true,
                templateUrl: PAGES_URL + "/app.html",
                controller: "appController",
                resolve:{
                    currentUser: ["userService", "$rootScope", "$state", function (userService, $rootScope, $state) {
                        return userService.getCurrentUser()
                        .then(function(user){
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
                resolve: {
                    currentUser: ["userService", "$rootScope", "$state", function (userService, $rootScope, $state) {
                            return userService.getCurrentUser()
                                .then(function(user){
                            if(user) {
                                $state.go("app.overview");
                            }
                        }, function () {
                        });
                    }]}
            })
            .state("logout",{
                controller: "logoutController"
            })
            .state("register",{
                url: "/register",
                templateUrl: "/registration",
                controller: "registerController"
              })
            .state("app.overview",{
                url: "/overview",
                templateUrl: PAGES_URL + "/overview.html",
                resolve: {
                    preferedView: ["preferencesService", function (preferencesService) {
                        return preferencesService.getOverviewListView();
                    }],
                    branches: ["branchService", function (branchService) {
                        return branchService.all();
                    }]
                },
                controller: "overviewController"
            })
            .state("app.shared", {
                url: "/shared",
                templateUrl: PAGES_URL + "/shared.html",
                controller: "sharedController"
            })
            .state("app.user", {
                url: "/user/:id",
                templateUrl: PAGES_URL + "/user.html",
                resolve: {
                    user: ["userService", "$stateParams", function (userService, $stateParams) {
                        return userService.get($stateParams.id);
                    }]
                },
                controller: "userController"
            })
            .state("app.profile", {
                url: "/profile",
                templateUrl: PAGES_URL + "/profile.html",
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
                    friends: ["friendsService", function(friendsService){
                        return friendsService.all();
                    }],
                    isFriendsBranchesDisplayModeList: ["preferencesService", function (preferencesService) {
                        return preferencesService.getFriendsBranchListView();
                    }],
                    isFriendsBookmarksDisplayModeList: ["preferencesService", function (preferencesService) {
                        return preferencesService.getFriendsBookmarkListView();
                    }]
                },
                controller: "friendsController"
            })
            .state("app.branch", {
                url: "/branch/:id/:name",
                templateUrl: PAGES_URL + "bookmarks.html",
                resolve: {
                    bookmarks: ["bookmarkService", "$stateParams", function(bookmarkService, $stateParams) {
                        return bookmarkService.allByBranch($stateParams.id);
                    }],
                    branch: ["branchService", "$stateParams", function (branchService, $stateParams) {
                        return branchService.get($stateParams.id);
                    }],
                    bookmarksDisplayMode: ["preferencesService", function (preferencesService) {
                        return preferencesService.getBookmarkListView();
                    }]
                },
                controller: "bookmarksController"
            })
            .state("app.notifications", {
                url: "/notifications",
                templateUrl: PAGES_URL + "notifications.html",
                resolve: {
                    notifications: ["notificationService", function (notificationService) {
                        return notificationsService.all();
                    }]
                },
                controller: "notificationsController"
            })
    }]);
});
