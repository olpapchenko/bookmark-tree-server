var multer = require("multer"),
    path = require("path"),
    appConfig = require("../../config/app_config"),
    logger = require("../utils/log/cntrlLog");

var  avatarStorage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, appConfig.avatarDir);
        },
        filename: function (req, file, cb) {
            var extension = path.extname(file.originalname) ? path.extname(file.originalname) : "";
            cb(null,  req.body.id + extension);
        }
    }),

    avatarUpload = multer({ storage: avatarStorage});

module.exports.avatar = function (req, resp) {
    avatarUpload.single("avatar")(req, resp, function(err) {
        if(err) {
            logger.error(err.message);
            resp.status(500).send("Internal Server Error");
        } else {
            resp.json({name: req.file.filename});
        }
    });
}