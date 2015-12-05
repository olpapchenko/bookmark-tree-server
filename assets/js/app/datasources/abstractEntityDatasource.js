angular.module("app").factory("abstractEntityDatasource", ["$state", function ($state) {
    var datasource = {};

    datasource.path = function(state) {
        return function (id) {
            return $state.href(state, {id: id});
        }
    };

    return datasource;
}]);