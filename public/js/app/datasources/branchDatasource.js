angular.module("app").factory("branchDatasource", ["$state", "abstractEntityDatasource", function ($state, abstractDatasource) {
    var STATE = "app.branch";

    var ds = {
        path: function (id) {
            return abstractDatasource.path(STATE)(id);
        }
    };

    return ds;
}]);