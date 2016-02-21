exports.up = function(knex, Promise) {
  return knex.schema.raw("CREATE INDEX tags_user_id_idx ON tags(user_id);");
};

exports.down = function(knex, Promise) {
  return knex.schema.raw("DROP INDEX tags_user_id_idx");
};
