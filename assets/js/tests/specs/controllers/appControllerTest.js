describe('AppController', function () {
    beforeEach(module('app'));

    var controller;

    beforeEach(inject(function (_controller_) {
        controller = _controller_;
    }))

    it('should sohould just pass test', function () {
            expect(true).toBe(true);
    });
})