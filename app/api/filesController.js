var multer = require("multer"),
    appConfig = require("../../config/app_config");
    path = require("path");

var  avatarStorage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, appConfig.avatarDir);
        },
        filename: function (req, file, cb) {
            var extension = file.originalname.match(/\..*/) ? file.originalname.match(/\..*/)[0] : "";
            cb(null,  req.body.id + extension);
        }
    }),

    avatarUpload = multer({ storage: avatarStorage});

module.exports.avatar = function (req, resp) {
    avatarUpload.single("avatar")(req, resp, function(err) {
        if(err) {
            resp.status(500).send("Internal Server Error");
        } else {
            resp.json({name: req.file.filename});
        }
    });
}