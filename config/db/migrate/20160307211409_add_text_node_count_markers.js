
exports.up = function(knex, Promise) {
    return knex.schema.table("markers", function (t) {
        t.integer("textNodePosition");
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("markers", function (t) {
      t.dropColumn("textNodePosition");
  })
};
