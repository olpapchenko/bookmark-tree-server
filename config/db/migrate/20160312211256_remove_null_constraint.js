
exports.up = function(knex, Promise) {
    return Promise.all([(knex.schema.table("links", function (t) {
        t.dropColumn("link");
    })).then(function () {
        return knex.schema.table("links", function (t) {
            t.text("link");
        });
    }),

    (knex.schema.table("comments", function (t) {
        t.dropColumn("text");
    })).then(function () {
        return knex.schema.table("comments", function (t) {
            t.text("text");
        });
    })]);
};

exports.down = function(knex, Promise) {
  
};
