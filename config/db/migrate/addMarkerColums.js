exports.up = function(knex, Promise) {
    return knex.schema.table("markers", function (t) {
        t.text("markerText");
        t.integer("position");
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table("markers", function (t) {
        t.dropColumns("markerText", "position");
    });
};