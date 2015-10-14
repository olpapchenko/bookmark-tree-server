angular.module('app', ['oc.lazyLoad','ui.router', 'ngDialog', 'dndLists', 'toaster']).config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        debug: true
    });
}]);