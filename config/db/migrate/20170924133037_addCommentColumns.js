exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.table("comments", function (t) {
            t.text("parentText");
        }),
        knex.schema.table("links", function (t) {
            t.text("parentText");
        })
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.table("comments", function (t) {
            t.dropColumn("parentText");
        }),
        knex.schema.table("links", function (t) {
            t.dropColumn("parentText");
        })
    ]);
};