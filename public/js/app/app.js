angular.module('app', ['oc.lazyLoad','ui.router', 'ngDialog', 'dndLists']).config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        debug: true
    });
}]);