describe('AppController', function () {
    beforeEach(module('app'));

    var $controller;

    beforeEach(module(function ($provide) {
        $provide.service("avatarService", avatarServiceFake);
        $provide.service("$state", stateServiceFake);
        $provide.service("notificationService", notificationServiceFake);
        $provide.factory("ngProgressFactory", ngProgressFactoryMock);
    }));

    beforeEach(inject(function ($injector) {
        $rootScope = $injector.get("$rootScope");
        $rootScope.currentUser = {avatar: "path"};
        avatarSevice = $injector.get("avatarService");
        notificationService = $injector.get("notificationService");
        $controller = $injector.get("$controller");
        appController = $controller("appController", {$scope: $rootScope});
    }));


    it('should set user avatar on the scope', function () {
        expect($rootScope.avatar).toBe(avatarSevice.getPath());
    });

    it("should set markAllRead on the scope and call notificationSerivice markRead inside it", function () {
        expect(typeof $rootScope.markAllRead).toBe("function");
        $rootScope.markAllRead();
        expect(notificationService.markAllRead).toHaveBeenCalled();
    });

    it("should track notifications", function () {
        expect(notificationService.trackNotifications).toHaveBeenCalled();
    });

    it("should set notifications in track notifications callback", function () {
       expect(angular.isArray($rootScope.notifications)).toBe(true);
    });

    it("should add relative time to notifications", function () {
        var result = $rootScope.notifications.filter(function (item) {
            return angular.isString(item.relative);
        });
        expect(result.length).not.toBe($rootScope.notifications.length);
    });

})