var Promise = require("bluebird"),
    Preferences = require("../models/preferences"),
    User = require("../models/user"),
    actionComposer = require("./actionComposer");

module.exports = {
    get: actionComposer({action: function (req, resp) {
        return Preferences.getPreferencesOrDefault({user_id: req.session.userId, key: req.query.key}).then(function (preference) {
            resp.json(preference);
        });
    }}),

    post: actionComposer({action: function (req, resp) {

        var newPreferences  = Object.keys(req.body).map(function (key) {
            return {key: key, value: req.body[key]}
        });

        var user = User.forge({id: req.session.userId});

        user.preferences().fetch().then(function (preferences) {
            if(preferences.size() == 0) {
                return Promise.map(newPreferences, function (preference) {
                    return user.preferences().create(preference);
                })
            } else {
                var promises = [];
                preferences.forEach(function (preference) {
                    var newPreference = newPreferences.filter(function (p) {
                        return p.key == preference.get("key");
                    });

                    promises.push(preference.save(newPreference[0], {method: 'update'}));
                });
                return Promise.all(promises);
            }
            }
        ).then(function(){
            resp.sendStatus(200);
        });
    }})
}