var router = require("express").Router();
var app_config = require("./app_config");


///=====api section
var bookmark = require("../app/api/bookmarkController"),
    user = require("../app/api/usersController"),
    branch = require("../app/api/branchController"),
    notifications = require("../app/api/notificationsController");

///routes

///=====api section=====
///bookmarks routes
router.get("/bookmark/:id", bookmark.get);
router.post("/bookmark", bookmark.post);

//branches routes
router.get("/branch/:id", branch.get);
router.get("/branches", branch.all);
router.post("/branch", branch.post);

//notifications routes
router.get("/notifications", notifications.get);

///users routes
router.get("/user/:id", user.get);
router.get("/user", user.current);
router.put("/user", user.put);
router.post("/registration", user.post);
router.post("/login", user.login);
router.post("/logout", user.logout);

///entry point
router.get("/", function (req, res){
    res.redirect("/index.html");
})

module.exports = router;