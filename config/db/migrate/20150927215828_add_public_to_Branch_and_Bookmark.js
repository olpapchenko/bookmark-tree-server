
exports.up = function(knex, Promise) {
    return Promise.all([knex.schema.table("branches", function(t){
        t.boolean("is_public");
    }),
    knex.schema.table("bookmarks", function(t){
        t.boolean("is_public");
    })]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.table("branches", function (t) {
      t.dropColumn("is_public");
  }), knex.schema.table("bookmarks", function (t) {
      t.dropColumn("is_public");
  })]);
};
