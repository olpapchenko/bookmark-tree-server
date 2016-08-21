define(["angular","app", "datasources/shareDatasourceAbstract", "services/branchService"], function() {
    angular.module("app").factory("shareDatasourceAllBranch", ["shareDatasourceAbstract", "branchService",
    function (shareDatasourceAbstract, branchService){
        var factory = Object.create(shareDatasourceAbstract);

        factory.persistanceService = branchService;

        return factory;
}]);});