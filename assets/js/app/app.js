define (["angular", "jquery", "angular-ui-router", "angular-drag-and-drop-lists", "ng-file-upload-all", "ngDialog", "toaster", "ngProgress"], function () {
    angular.module('app', ['ui.router', 'dndLists', 'ngDialog', 'toaster', 'ngProgress', 'ngFileUpload']);
    $(document).ready(function () {
        console.log("bootstrap");
        angular.bootstrap(document, ['app']);
    });
});
