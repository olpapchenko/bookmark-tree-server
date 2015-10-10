
exports.up = function(knex, Promise) {
    return knex.schema.createTable("branches_bookmarks", function (t) {
        t.integer("branch_id").references("id").inTable("branches").onDelete("cascade");
        t.integer("bookmark_id").references("id").inTable("bookmarks").onDelete("cascade");
        t.unique(["branch_id", "bookmark_id"]);
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("branches_bookmarks");
};
