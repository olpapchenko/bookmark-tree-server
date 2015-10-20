angular.module('app', ['oc.lazyLoad','ui.router', 'ngDialog', 'dndLists', 'toaster', 'ngProgress', 'ngFileUpload']).config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        debug: true
    });
}]);