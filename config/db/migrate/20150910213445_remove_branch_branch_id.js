
exports.up = function(knex, Promise) {
    return knex.schema.table("branches", function (t) {
        t.dropColumn("branch_id");
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table("branches", function (t) {
        t.integer("branch_id");
    });
};
