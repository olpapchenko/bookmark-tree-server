var Preferences = require("../models/preferences"),
    actionComposer = require("./actionComposer");

module.exports = {
    get: actionComposer({action: function (req, resp) {
        return Preferences.getPreferencesOrDefault({user_id: req.session.userId, key: req.query.key}).then(function (preference) {
            resp.json(preference);
        });
    }}),

    post: actionComposer({action: function (req, resp) {
         Preferences.forge({user_id: req.session.userId, key: req.body.key}).saveBasedOnParams({value: req.body.value}).then(function () {
            resp.sendStatus(200);
        });
    }})
}