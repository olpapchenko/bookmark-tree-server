
exports.up = function(knex, Promise) {
    return knex.schema.table("bookmarks_branches", function (t) {
        t.increments("id").primary();
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.table("bookmarks_branches", function(t) {
        t.dropColumn("id");
    })
};
