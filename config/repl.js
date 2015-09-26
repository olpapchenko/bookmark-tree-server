var repl = require("repl").start({}),
    promisify = require("repl-promised").promisify,
    bookmark = require('../app/models/bookmark');
    users = require('../app/models/user');
    rights = require('../app/models/branchRights');
    notifications = require('../app/models/notification');
    branch = require('../app/models/branch');
repl.context.bookmarks = bookmark;
repl.context.branch = branch;
repl.context.users = users;
repl.context.rights = rights;
repl.context.comments = require("../app/models/comment");
repl.context.notifications = notifications;
promisify(repl);