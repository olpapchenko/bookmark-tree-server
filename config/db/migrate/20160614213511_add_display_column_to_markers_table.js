
exports.up = function(knex, Promise) {
    return knex.schema.table("markers", function (t) {
        t.boolean("display");
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table("markers", function (t) {
        t.dropColumn("display");
    })
};
