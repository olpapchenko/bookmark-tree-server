
exports.up = function(knex, Promise) {
    return Promise.all([knex.schema.table("markers", function (t) {
        t.string("md5", 32);
    }), knex.schema.table("comments", function (t) {
        t.string("md5", 32);
    }), knex.schema.table("links", function (t) {
        t.string("md5", 32);
    })]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.table("markers", function (t) {
      t.dropColumn("md5");
  }), knex.schema.table("comments"), function (t) {
      t.dropColumn("md5");
  }, knex.schema.table("links", function (t) {
      t.dropColumn("md5");
  })]);
};
