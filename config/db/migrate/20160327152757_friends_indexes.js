
exports.up = function(knex, Promise) {
    return knex.schema.raw("CREATE INDEX friend_user_idx ON friends(user_id, friend_id); " +
    "CREATE INDEX user_friend_idx ON friends(friend_id, user_id);");
};

exports.down = function(knex, Promise) {
    return knex.schema.raw("DROP INDEX friend_user_idx;" +
    "DROP INDEX user_friend_idx;");
};
