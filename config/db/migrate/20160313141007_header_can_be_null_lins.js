
exports.up = function(knex, Promise) {
    return (knex.schema.table("links", function (t) {
        t.dropColumn("header");
    })).then(function () {
        return knex.schema.table("links", function (t) {
            t.text("header");
        });
    });
};

exports.down = function(knex, Promise) {
  
};
