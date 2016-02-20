
exports.up = function(knex, Promise) {
    return knex.schema.table("comments", function (t) {
       t.dropColumn("x", "y", "visible");
        t.integer("startOffset");
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("comments", function (t) {
      t.integer("x");
      t.integer("y");
      t.bool("visible");
      t.dropColumn("startOffset");
  })
};
