
exports.up = function(knex, Promise) {
    return knex.schema.table("markers", function (t) {
        t.integer("startTextNodePosition");
        t.integer("endTextNodePosition");
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("markers", function (t) {
      t.dropColumn("startTextNodePosition");
      t.dropColumn("endTextNodePosition");
  })
};
