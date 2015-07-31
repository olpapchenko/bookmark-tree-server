angular.module('app', ['oc.lazyLoad','ui.router']).config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        debug: true
    });
}]);