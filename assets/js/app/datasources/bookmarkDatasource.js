angular.module("app").factory("bookmarkDatasource", ["$state", "abstractEntityDatasource", function ($state, abstractDatasource) {
    var STATE = "app.bookmark";

    var ds = {
        path: function (id, name) {
            return abstractDatasource.path(STATE)(id) + "/" + name;
        }
    };

    return ds;
}]);