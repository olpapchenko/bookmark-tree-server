
exports.up = function(knex, Promise) {
    return knex.schema.table("bookmarks", function (t) {
        t.string("screenshot");
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table("bookmarks", function () {
        t.dropColumn("screenshot");
    });
};
