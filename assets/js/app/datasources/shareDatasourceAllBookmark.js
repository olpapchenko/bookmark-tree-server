angular.module("app").factory("shareDatasourceAllBookmark", ["shareDatasourceAbstract", "bookmarkService",
    function (shareDatasourceAbstract, bookmarkService){
        var factory = Object.create(shareDatasourceAbstract);

        factory.persistanceService = bookmarkService;

        return factory;
}]);