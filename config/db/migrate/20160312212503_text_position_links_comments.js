
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.table("comments", function (t) {
            t.integer("textPosition").notNull();
        }),
        knex.schema.table("links", function (t) {
            t.integer("textPosition").notNull();
        })
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.table("comments", function (t) {
            t.dropColumn("textPosition");
        }),
        knex.schema.table("links", function (t) {
            t.dropColumn("textPosition");
        })
    ]);
};
