angular.module("app").factory("shareDatasourceAll", ["shareDatasourceAbstract", "bookmarkService",
    function (shareDatasourceAbstract, bookmarkService){
        var factory = Object.create(shareDatasourceAbstract);

        factory.getSharedWith = function () {
            return bookmarkService.getShareInfo();
        }

        return factory;
}]);