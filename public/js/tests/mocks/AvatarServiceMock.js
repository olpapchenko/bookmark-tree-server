avatarServiceFake = function () {
    this.getPath = jasmine.createSpy("getPath").and.callFake(function () {
        return "/imaget/image.jpg";
    });
}