var router = require("express").Router();
var app_config = require("./app_config");


///=====api section
var bookmark = require("../app/api/bookmarkController"),
    user = require("../app/api/usersController"),
    branch = require("../app/api/branchController"),
    notifications = require("../app/api/notificationsController"),
    friends = require("../app/api/friendsController");

///routes

///=====api section=====
///bookmarks routes
router.get("/bookmark/:id", bookmark.get);
router.post("/bookmark", bookmark.post);
router.post("/bookmark/share", bookmark.share);
router.post("/bookmark/unshare", bookmark.unshare);

//branches routes
router.get("/branch/:id", branch.get);
router.get("/branches", branch.all);
router.post("/branch", branch.post);
router.post("/branch/share", branch.share);
router.post("/branch/unshare", branch.unshare);

//notifications routes
router.get("/notifications", notifications.get);

///users routes
router.get("/user/:id(\\d+)", user.get);
router.get("/user", user.current);
router.get("/user/:name", user.byName);
router.put("/user", user.put);
router.post("/registration", user.post);
router.post("/login", user.login);
router.post("/logout", user.logout);

// friends routes
router.get("/friends", friends.get);

///entry point
router.get("/", function (req, res){
    res.redirect("/login.html");
})

module.exports = router;