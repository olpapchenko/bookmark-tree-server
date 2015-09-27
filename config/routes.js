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
router.post("/bookmark/remove", bookmark.remove);

//branches routes
router.get("/branch", branch.get);
router.get("/branches", branch.all);
router.get("/branch/share", branch.getShareInformation);
router.post("/branch", branch.post);
router.post("/branch/remove", branch.remove);
router.post("/branch/share", branch.share);

//notifications routes
router.get("/notifications", notifications.get);
router.post("/notifications/read", notifications.read);

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
router.post("/friends", friends.post);
router.post("/friends/remove", friends.remove);
router.get("/friends/shared/:id(\\d+)", friends.shared);

///entry point
router.get("/", function (req, res){
    res.redirect("/login.html");
})

module.exports = router;