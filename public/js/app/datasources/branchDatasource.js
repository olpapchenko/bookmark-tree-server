angular.module("app").factory("branchDatasource", ["$state", "abstractEntityDatasource", function ($state, abstractDatasource) {
    var STATE = "app.branch";

    var ds = {
        path: abstractDatasource.path(STATE)
    };

    return ds;
}]);