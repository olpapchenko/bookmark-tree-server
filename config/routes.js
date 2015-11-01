var router = require("express").Router();
var app_config = require("./app_config");


///=====api section
var bookmark = require("../app/api/bookmarkController"),
    user = require("../app/api/usersController"),
    branch = require("../app/api/branchController"),
    notifications = require("../app/api/notificationsController"),
    friends = require("../app/api/friendsController"),
    files = require("../app/api/filesController");

///routes

///=====api section=====
///bookmarks routes
router.get("/bookmark/share", bookmark.getShareInformation);
router.get("/bookmark", bookmark.get);
router.get("/bookmark/branch", bookmark.allByBranch);
router.post("/bookmark", bookmark.post);
router.post("/bookmark/share", bookmark.share);
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
router.get("/notifications/all", notifications.all);
router.post("/notifications/read", notifications.read);

///users routes
router.get("/user/:id(\\d+)", user.get);
router.get("/user", user.current);
router.get("/user/:name", user.byName);
router.get("/user/mail/availability", user.checkMailAvailability);
router.post("/user/update", user.put);
router.post("/registration", user.post);
router.post("/login", user.login);
router.post("/logout", user.logout);

// friends routes
router.get("/friends", friends.get);
router.post("/friends", friends.post);
router.post("/friends/remove", friends.remove);
router.get("/friends/shared/:id(\\d+)", friends.shared);

// files routes
router.post("/uploads/avatar", files.avatar);

///entry point
router.get("/", function (req, res){
    res.redirect("/login.html");
})

module.exports = router;