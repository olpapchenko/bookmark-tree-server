
exports.up = function(knex, Promise) {
  return knex.schema.table("branches", function(t) {
      t.boolean("default");
  });
};

exports.down = function(knex, Promise) {
    return knex.schema.table("branches", function(t) {
        t.dropColumn("default");
    })
};
