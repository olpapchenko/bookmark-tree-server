angular.module("app").directive("addEntity", ["editHandler", "addBranchDatasource", function (editHandler, addBranchDatasource) {
    return {
        scope: {
            isBranch: "="
        },
        templateUrl: "/html/templates/addEntityButton.html",
        link: function (scope, iElement, attrs) {
            scope.add = editHandler(addBranchDatasource);
        }
    }
}]);