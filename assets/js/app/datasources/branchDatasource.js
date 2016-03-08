angular.module("app").factory("branchDatasource", ["$state", "abstractEntityDatasource", function ($state, abstractDatasource) {
    var STATE = "app.branch";

    var ds = {
        path: function (entity) {
            return abstractDatasource.path(STATE)(entity.id);
        }
    };

    return ds;
}]);