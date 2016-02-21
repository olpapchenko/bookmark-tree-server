
exports.up = function(knex, Promise) {
    return knex.schema.createTable("bookmarks_tags", function (t) {
       t.integer("tag_id").references("id").inTable("tags");
        t.integer("bookmark_id").references("id").inTable("bookmarks");
        t.primary(["tag_id", "bookmark_id"]);
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("bookmarks_tags");
};
