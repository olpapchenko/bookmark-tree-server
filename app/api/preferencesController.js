var Promise = require("bluebird"),
    Preferences = require("../models/preferences"),
    User = require("../models/user"),
    actionComposer = require("./actionComposer"),
    mandatoryParamFilter = require("../filters/mandatoryParamFilter");


module.exports = {
    get: actionComposer({action: function (req, resp) {
        return Preferences.getPreferencesOrDefault({user_id: req.session.userId}).then(function (preferences) {
            resp.json({preferences: preferences});
        });
    }}),

    post: actionComposer({
        beforeFilters: [mandatoryParamFilter(["preferences"])],
        action: function (req, resp) {
        var preferences = req.body.preferences.map(function (preference) {
            preference.user_id = req.session.userId;
            return preference
        });

        return Promise.map(preferences, function (pereference) {
            return Preferences.forge(pereference).save();
        }).then(function(){
            resp.sendStatus(200);
        });
    }})
}