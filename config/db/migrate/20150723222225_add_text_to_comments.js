
exports.up = function(knex, Promise) {
    return knex.schema.table("comments", function (t) {
        t.text("text").notNull();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("comments", function(t) {
      t.dropColumns("text");
  });
};
