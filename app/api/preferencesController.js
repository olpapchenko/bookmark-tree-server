var Promise = require("bluebird"),
    Preferences = require("../models/preferences"),
    User = require("../models/user"),
    actionComposer = require("./actionComposer");

module.exports = {
    get: actionComposer({action: function (req, resp) {
        return Preferences.getPreferencesOrDefault({user_id: req.session.userId}).then(function (preference) {
            resp.json(preference);
        });
    }}),

    post: actionComposer({action: function (req, resp) {

        var preferences = req.body.preferences.map(function (preference) {
            preference.user_id = req.session.userId;
            return preference
        });

        Promise.map(preferences, function (pereference) {
            return Promise.forge(pereference).save();
        }).then(function(){
            resp.sendStatus(200);
        });
    }})
}