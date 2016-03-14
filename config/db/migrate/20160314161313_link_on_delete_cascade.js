
exports.up = function(knex, Promise) {
    return knex.schema.table("links", function (t) {
        t.dropColumn("bookmark_id");
    }).then(function () {
        return knex.schema.table("links", function (t) {
           t.integer("bookmark_id").references("id").inTable("bookmarks").onDelete("cascade");
        });
    });
};

exports.down = function(knex, Promise) {
  
};
