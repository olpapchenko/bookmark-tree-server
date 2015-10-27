
exports.up = function(knex, Promise) {
    return knex.schema.table("notifications", function (t) {
        t.smallint("type").notNull();
        t.integer("context");
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.table("notifications", function (t) {
        t.dropColumn("type");
        t.dropColumn("context");
    })
};
