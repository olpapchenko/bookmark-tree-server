var multer = require("multer"),
    path = require("path"),
    appConfig = require("../../config/app_config"),
    logger = require("../utils/log/cntrlLog");


var avatarUpload = multer({storage: getDiscStorage(appConfig.avatarDir)}),
    screenshotsStorage = multer({storage: getDiscStorage(appConfig.screenshotsStorage)});

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

module.exports.screenshot = function (req, resp) {

    screenshotsStorage.single("screen")(req, resp, function(err) {
        if(err) {
            logger.error(err.message);
            resp.status(500).send("Internal Server Error");
        } else {
            resp.json({name: req.file.filename});
        }
    });
}

function getDiscStorage(pathOnTheDisk) {
    return multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, pathOnTheDisk);
        },
        filename: function (req, file, cb) {
            var extension = path.extname(file.originalname) ? path.extname(file.originalname) : "";
            cb(null,  req.body.id + extension);
        }
    })
}