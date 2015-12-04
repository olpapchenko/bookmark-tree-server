var baseController = require("./baseController"),
    controller = function () {
        var _this = this;
        this.get = function (req, resp) {
            resp.render("register", _this.baseContext);
        }
    }

controller.prototype = baseController;

module.exports = new controller();