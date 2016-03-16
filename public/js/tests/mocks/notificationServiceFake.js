notificationServiceFake = function () {
    this.trackNotifications = jasmine.createSpy("trackNotifications").and.callFake(function (callback) {
        var notifications = [];
        callback(notifications);
    });
    this.all = jasmine.createSpy("all");
    this.markAllRead = jasmine.createSpy("markAllRead");
}