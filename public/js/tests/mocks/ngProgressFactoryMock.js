ngProgressFactoryMock = function () {
    return {
        createInstance: function () {
            return {
                start: jasmine.createSpy("start"),
                complete: jasmine.createSpy("complete")
            }
        }
    }
}