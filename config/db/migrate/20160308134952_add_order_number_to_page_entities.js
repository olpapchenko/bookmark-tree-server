
exports.up = function(knex, Promise) {
    return Promise.all([knex.schema.table("markers", function (t) {
        t.integer("order");
    }), knex.schema.table("comments", function (t) {
        t.integer("order");
    }),knex.schema.table("links", function (t) {
        t.integer("order");
    })]);
};

exports.down = function(knex, Promise) {
    return Promise.all([knex.schema.table("markers", function (t) {
        t.dropColumn("order");
    }), knex.schema.table("comments", function (t) {
        t.dropColumn("order");
    }), knex.schema.table("links", function (t) {
        t.dropColumn("order");
    })]);
};
