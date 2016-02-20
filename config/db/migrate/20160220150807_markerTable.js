
exports.up = function(knex, Promise) {
    return knex.schema.table("markers", function (t) {
            t.dropColumns("colour", "marker", "selector");
            t.text("startContainerSelector");
            t.text("endContainerSelector");
            t.text("commonAncestorContainer");
            t.integer("startOffset");
            t.integer("endOffset");
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table("markers", function (t) {
       t.string("colour", 20);
        t.string("selector", 100);
        t.text("marker");
        t.dropColumns("startContainerSelector", "endContainerSelector", "startOffset", "endOffset");
    });
};
