
exports.up = function(knex, Promise) {
    return knex.schema.createTable("tags", function (t) {
        t.increments("id").primary();
        t.integer("user_id").references("id").inTable("users");
        t.string("name",20).notNull();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable("tags");
};
//knex.schema.raw("CREATE INDEX tags_user_id_idx ON tags(user_id text_pattern_ops);"
//knex.schema.raw("DROP INDEX tags_user_id_idx")
