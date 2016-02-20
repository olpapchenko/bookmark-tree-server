
exports.up = function(knex, Promise) {
  return Promise.all ([knex.schema.createTable("links", function (t) {
      t.increments("id").primary();
      t.integer("bookmark_id").references("id").inTable("bookmarks");
      t.integer("startOffset").notNull();
      t.text("selector").notNull();
      t.text("link").notNull();
  }), knex.schema.dropTable("bookmarks_bookmarks")]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable("links"),
    knex.schema.createTable("bookmarks_bookmarks", function (t) {
      t.integer("bookmark").references("id").inTable("bookmarks");
      t.integer("references").references("id").inTable("bookmarks");
    })
  ]);
};
