angular.module('app', ['oc.lazyLoad','ui.router', 'ngDialog']).config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        debug: true
    });
}]);