
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable("users", function (t){
            t.increments("id").primary();
            t.string("name", 100);
            t.string("mail", 100).unique().notNull();
            t.string("avatar", 100);
            t.string("password",50).notNull();
            t.text("about");
        }),
        knex.schema.createTable("rights", function (t) {
            t.increments("id").primary();
            t.boolean("read");
            t.boolean("write");
            t.integer("user_id").references("id").inTable("users");
        }),
        knex.schema.createTable("bookmarks", function (t) {
            t.increments("id").primary();
            t.text("name").notNull();
            t.text("url").notNull();
            t.timestamp("created_at").defaultTo(knex.raw('current_timestamp'));
        }),
        knex.schema.createTable("bookmarks_bookmarks", function (t) {
            t.integer("bookmark").notNull().references("id").inTable("bookmarks").onDelete("cascade");
            t.integer("references").notNull().references("id").inTable("bookmarks").onDelete("cascade");
        }),
        knex.schema.createTable("comments", function(t) {
            t.increments("id").primary();
            t.integer("bookmark_id").references("id").inTable("bookmarks").onDelete("cascade");
            t.text("selector").notNull();
            t.integer("x");
            t.integer("y");
            t.boolean("visible");
        }),
        knex.schema.createTable("markers", function(t){
            t.increments("id").primary();
            t.integer("bookmark_id").references("id").inTable("bookmarks").onDelete("cascade");
            t.text("marker");
            t.string("selector",500);
            t.string("colour",10)
        })
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable("bookmarks_users"),
        knex.schema.dropTable("bookmarks_bookmarks"),
        knex.schema.dropTable("markers"),
        knex.schema.dropTable("rights"),
        knex.schema.dropTable("comments"),
        knex.schema.dropTable("users"),
        knex.schema.dropTable("bookmarks"),
    ]);
};
