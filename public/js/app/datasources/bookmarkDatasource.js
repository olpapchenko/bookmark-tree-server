angular.module("app").factory("bookmarkDatasource", ["$state", "abstractEntityDatasource", function ($state, abstractDatasource) {
    var STATE = "app.bookmark";

    var ds = {
        path: function (entity) {
            return entity.url;
        }
    };

    return ds;
}]);