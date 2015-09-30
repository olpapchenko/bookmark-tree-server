var Bookshelf = require ('../../config/db/bookshelf');
var _ = require('underscore');

var abstractModel = Bookshelf.Model.extend({
    saveBasedOnParams : function (attrs, options) {
        options = options || {};
        return this.fetch().then(function (model) {
            var isSaved = model == null;
            model = model || this;
            model.save(attrs, _.extend({method: isSaved? 'insert' : 'update'}, options)).then(function () {
                return isSaved;
            });
        })
    }
});

module.exports = Bookshelf.model("AbstractModel", abstractModel);