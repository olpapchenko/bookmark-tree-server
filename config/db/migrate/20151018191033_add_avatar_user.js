
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.table("users", function (t) {
            t.dropColumn("avatar");
        }),
        knex.schema.table("users", function (t) {
             t.string("avatar", 1000);
        })]);
};

exports.down = function(knex, Promise) {
  return knex.schema.table("users", function (t) {
      t.dropColumn("avatar");
  })
};
