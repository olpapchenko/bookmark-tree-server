
exports.up = function(knex, Promise) {
    return Promise.all([knex.schema.table("links", function(t) {
        t.boolean("display");
    }), knex.schema.table("comments", function (t) {
        t.boolean("display");
    })]);
};

exports.down = function(knex, Promise) {
    return Promise.all([knex.schema.table("links", function (t) {
        t.dropColumn("display")
    }), knex.schema.table("comments", function (t) {
        t.dropColumn("display");
        t.dropColumn("display");
    })]);
};
