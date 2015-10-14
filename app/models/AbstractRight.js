var Promise = require("bluebird");

var Bookshelf = require ('../../config/db/bookshelf');

var AbstractModel = require("./AbstractModel");
var logger = require("../utils/log/modelLog");

var model = AbstractModel.extend({

}, {
    updateRights: function (rights, entity, entity_key, changeCallback) {
        _this = this;

        rights.owners = rights.owners || [];
        rights.observers = rights.observers || [];

        logger.info("update right for: ", rights);

        return Bookshelf.transaction(function (t) {
                return Promise.map(rights.owners, function (userId) {

                    logger.info("set user as owner userId: ", userId);

                    var right = {};
                    right[entity_key] = rights.id;
                    right.user_id = userId;
                    return _this.forge(right).saveBasedOnParams({owner: true}, {transacting: t}).then(function (isSaved) {
                        if(changeCallback) {
                            return changeCallback(isSaved, userId);
                        }
                    });
                }, {concurrency: 1})
            .then(function () {
                    return Promise.map(rights.observers, function (userId) {

                        logger.info("set user as observer userId: ", userId);

                        var right = {};
                        right[entity_key] = rights.id;
                        right.user_id = userId;
                        return _this.forge(right).saveBasedOnParams({owner: false}, {transacting: t}).then(function (isSaved) {
                            if(changeCallback) {
                                return changeCallback(isSaved, userId);
                            }
                        });
                    }, {concurrency: 1});
            })
            .then(function () {
                    return Promise.map(rights.removed, function (userId) {
                        var right = {};
                        right[entity_key] = rights.id;
                        right.user_id = userId;
                        return _this.forge(right).fetch()
                        .then(function (t) {
                            return t.destroy({transaction: t});
                        })
                        .then(function () {
                            if(changeCallback) {
                                return changeCallback(null, userId);
                            }
                        })
                    }, {concurrency: 1});
            })
            .then(function () {
                    return entity.forge({id: rights.id, is_public: rights.isPublic}).save(null, {transacting: t});
            });
        });

    },

    attachOwnershipInfo: function (model, entity_key, userId) {
        var right = {};
        right[entity_key] = model.id;
        right.user_id = userId;
        return this.forge(right).fetch().then(function (right) {
            model.set({isOwner: right ? right.get("owner") : false});
            return model;
        });
    }
});

module.exports = Bookshelf.model("AbstractRight", model);