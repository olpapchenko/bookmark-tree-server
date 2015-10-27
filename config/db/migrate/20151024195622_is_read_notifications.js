
exports.up = function(knex, Promise) {
    return knex.schema.table("notifications", function (t) {
        t.boolean("is_read");
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.table("notifications", function (t) {
        t.dropColumn("is_read");
    })
};
