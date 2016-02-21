
exports.up = function(knex, Promise) {
    return knex.schema.table("links", function (t) {
        t.text("header").notNull();
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.table("links", function (t) {
        t.dropColumn("header");
    });
};
