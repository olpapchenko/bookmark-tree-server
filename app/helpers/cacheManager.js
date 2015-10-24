var Promise = require("bluebird"),
    Cache = require("../../config/cache"),

    logger = require("../utils/log/modelLog");

module.exports = function(entity) {

    this.entity = entity;

    this.get = function (id) {
        var promised = Promise.promisify(Cache.get)
            _this = this;

        return promised(entity.getCacheKey(id))
                .then(function (value) {
                    return value ? value : _this.entity.getObjectForCacheStore(id).tap(function (data) {
                        return data.models ? _this.putIntoCache(id, data.models) : undefined;
                    });
                });
    };

    this.putIntoCache = function (id, data) {
        var promised = Promise.promisify(Cache.set);

        return promised(entity.getCacheKey(id), data)
               .then(null, function (err) {
                    logger.error(err.message);
                    return Promise.reject(err);
               });
    }

    this.delete = function (userId, stayKeyInCache) {
        if(stayKeyInCache) {
            Cache.set(this.entity.getCacheKey(userId), []);
        } else {
            Cache.delete(this.entity.getCacheKey(userId));
        }
    }
}