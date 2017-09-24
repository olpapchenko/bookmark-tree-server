
exports.up = function(knex, Promise) {
    return Promise.all([
            knex.schema.table("links", function (t) {
                t.dropColumn("selector");
            }),
            knex.schema.table("comments", function (t) {
                t.dropColumn("selector");
            })]
        );
};

exports.down = function(knex, Promise) {
    return Promise.all([
            knex.schema.table("links", function (t) {
                t.text("selector");
            }),
            knex.schema.table("comments", function (t) {
                t.text("selector");
            })
    ]);
};
