var repl = require("repl").start({}),
    promisify = require("repl-promised").promisify,
    bookmark = require('../app/models/bookmark');
    users = require('../app/models/user');
repl.context.bookmarks = bookmark;
repl.context.users = users
promisify(repl);