
exports.up = function(knex, Promise) {
    return knex.schema.table("users", function (t) {
        t.integer("origin");
     });
};

exports.down = function(knex, Promise) {
    return knex.schema.table("users", function (t) {
        t.dropColumn("origin");
     });
};
