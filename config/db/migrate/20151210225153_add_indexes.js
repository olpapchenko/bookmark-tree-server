
exports.up = function(knex, Promise) {
    return knex.schema.raw("CREATE INDEX users_user_name_idx ON users(name text_pattern_ops); " +
                            "CREATE INDEX notifications_is_read ON notifications(user_id, is_read); " +
                            "CREATE INDEX branch_rights_user_id ON branch_rights(user_id); " +
                            "CREATE INDEX branch_rights_owner ON branch_rights(owner); ");
};

exports.down = function(knex, Promise) {
    return knex.schema.raw("DROP INDEX users_user_name_idx;" +
                            "DROP INDEX notifications_is_read;" +
                            "DROP INDEX branch_rights_user_id;" +
                            "DROP INDEX branch_rights_owner;");
};
