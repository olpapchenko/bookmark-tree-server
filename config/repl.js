var repl = require("repl").start({}),
    promisify = require("repl-promised").promisify,
    bookmark = require('../app/models/bookmark');
    users = require('../app/models/user');
    rights = require('../app/models/rights');
repl.context.bookmarks = bookmark;
repl.context.users = users;
repl.context.rights = rights;
repl.context.comments = require("../app/models/comment");
promisify(repl);