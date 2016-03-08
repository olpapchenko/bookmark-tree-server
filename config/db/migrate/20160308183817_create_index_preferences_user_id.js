
exports.up = function(knex, Promise) {
    return knex.schema.raw("CREATE INDEX preferences_user_id_idx ON preferences(user_id);");
};

exports.down = function(knex, Promise) {
   return knex.schema.raw("DROP INDEX preferences_user_id_idx");
};
