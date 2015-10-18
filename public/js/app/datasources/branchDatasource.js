angular.module("app").factory("branchDatasource", ["$state", "abstractEntityDatasource", function ($state, abstractDatasource) {
    var STATE = "app.branch";

    var ds = {
        path: function (id, name) {
            return abstractDatasource.path(STATE)(id) +  name;
        }
    };

    return ds;
}]);