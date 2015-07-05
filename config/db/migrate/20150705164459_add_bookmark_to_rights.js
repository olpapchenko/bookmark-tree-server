
exports.up = function(knex, Promise) {
  return knex.schema.table("rights", function (t) {
      !t.integer("bookmark_id").notNull().references("id").inTable("bookmarks").onDelete("cascade");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("tights").dropColumn("bookmark_id");
};
