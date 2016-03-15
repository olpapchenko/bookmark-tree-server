var Promise = require("bluebird");

var Bookshelf = require ('../../config/db/bookshelf');

var AbstractModel = require("./AbstractModel");
var logger = require("../utils/log/modelLog");

var model = AbstractModel.extend({

}, {
    updateRights: function (rights, entity, entity_key, changeCallback) {
        var _this = this;

        rights.owners = rights.owners || [];
        rights.observers = rights.observers || [];

        logger.info("update right for: ", rights);

        return Bookshelf.transaction(function (t) {
            if(!rights.owners) {
                return;
            }
                return Promise.map(rights.owners, function (userId) {

                    logger.info("set user as owner userId: ", userId);

                    var right = {};
                    right[entity_key] = rights.id;
                    right.user_id = userId;
                    return _this.forge(right).saveBasedOnParams({owner: true}, {transacting: t}).then(function (isSaved) {
                        if(changeCallback) {
                            return changeCallback(isSaved, userId, rights.id, "addOwner");
                        }
                    });
                }, {concurrency: 1})
                .then(function () {
                        if(!rights.observers) {
                            return;
                        }
                        return Promise.map(rights.observers, function (userId) {

                            logger.info("set user as observer userId: ", userId);

                            var right = {};
                            right[entity_key] = rights.id;
                            right.user_id = userId;
                            return _this.forge(right).saveBasedOnParams({owner: false}, {transacting: t}).then(function (isSaved) {
                                if(changeCallback) {
                                    return changeCallback(isSaved, userId, rights.id, "addObserver");
                                }
                            });
                        }, {concurrency: 1});
                })
                .then(function () {
                        if(!rights.removed) {
                            return;
                        }
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
                                    return changeCallback(null, userId, rights.id, "unShare");
                                }
                            })
                        }, {concurrency: 1});
                })
                .then(function () {
                        return entity.forge({id: rights.id, is_public: rights.isPublic}).save(null, {transacting: t});
                });
        });

    },

    attachOwnershipInfo: function (model, entity_key) {
        var right = {};
        right[entity_key] = model.id;

        return this.query(function (qb){ qb.where(entity_key, model.id)}).fetchAll().then(function (rightz) {
            var rights = {};

            rightz.map(function (right) {
                rights[right.get("user_id")] = right.get("owner");
            });

            model.set({rightsInfo: rights});

            return model;
        });
    },

    attachOwnershipInfos: function (models, entity_key, userId) {
        var _this = this;

        var models = models.map(function (entity) {
            return _this.attachOwnershipInfo(entity, entity_key, userId);
        });

        return Promise.all(models);
    }
});

module.exports = Bookshelf.model("AbstractRight", model);