var Bookshelf = require ('../../config/db/bookshelf');

var abstractModel = Bookshelf.Model.extend({
    saveBasedOnParams : function (attrs) {
        return this.fetch().then(function (model) {
            var isSaved = model == null;
            model = model || this;
            model.save(attrs, {method: isSaved? 'insert' : 'update'}).then(function () {
                return isSaved;
            });
        })
    }
});

module.exports = Bookshelf.model("AbstractModel", abstractModel);