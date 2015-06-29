var router = require("express").Router();
var app_config = require("./app_config");


///=====api section
var bookmark = require("../app/api/bookmarkController");
var user = require("../app/api/usersController");

///routes

///=====api section
///bookmarks routes
router.get("/bookmark/:id", bookmark.get);
router.put("/bookmark", bookmark.put);
router.post("/bookmark", bookmark.post);

///users routes
router.get("/user/:id", user.get);
router.put("/user", user.post);
router.post("/user", user.post);

///entry point
router.get("/", function (req, res){
    res.redirect("/index.html");
})

module.exports = router;