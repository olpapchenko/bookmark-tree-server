
exports.up = function(knex, Promise) {
    return knex.schema.createTable("preferences", function (t){
        t.increments("id").primary();
        t.integer("user_id").references("id").inTable("users").notNull();
        t.integer("key").notNull();
        t.string("value").notNull();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable("preferences");
};
