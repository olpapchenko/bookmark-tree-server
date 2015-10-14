
exports.up = function(knex, Promise) {
    return knex.schema.table("bookmarks_branches", function (t) {
        t.integer("user_id").references("id").inTable("users").notNull();
    })
};

exports.down = function(knex, Promise) {
   return knex.schema.table("bookmarks_branches", function (t) {
       t.dropColumn("user_id");
   })
};
