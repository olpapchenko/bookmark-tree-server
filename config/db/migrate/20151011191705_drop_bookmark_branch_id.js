
exports.up = function(knex, Promise) {
    return knex.schema.table("bookmarks", function (t) {
        t.dropColumn("branch_id");
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table("bookmarks", function (t) {
        t.integer("branch_id").references("id").inTable("branches");
    });
};
