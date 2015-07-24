
exports.up = function(knex, Promise) {
    knex.schema.createTable("notifications", function (t) {
        t.increments("id").primary();
        t.integer("type").notNull();
        t.integer("user_id").references("id").inTable("users").onDelete("cascade");
        t.timestamp("created_at").defaultTo(knex.raw('current_timestamp'));
    })
};

exports.down = function(knex, Promise) {
    knex.schema.dropTable("notification");
};
