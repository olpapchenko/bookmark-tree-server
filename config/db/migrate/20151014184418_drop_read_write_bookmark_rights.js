
exports.up = function(knex, Promise) {
    return knex.schema.table("bookmark_rights", function (t) {
        t.dropColumn("read");
        t.dropColumn("write");
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.table("bookmark_rights", function (t) {
        t.boolean("read");
        t.boolean("write");
    });
};
