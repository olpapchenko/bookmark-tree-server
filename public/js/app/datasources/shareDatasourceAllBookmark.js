angular.module("app").factory("shareDatasourceAll", ["shareDatasourceAbstract", "branchService",
    function (shareDatasourceAbstract, branchService){
        var factory = Object.create(shareDatasourceAbstract);

        factory.getSharedWith = function () {
            return branchService.getShareInfo();
        }

        return factory;
}]);