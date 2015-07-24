
exports.up = function(knex, Promise) {
    knex.schema.createTable("branches", function (t) {
        t.increments("id").primary();
        t.integer("branch_id").references("id").inTable("branches").onDelete("cascade");
        t.string("name", 20);
        t.integer("user_id").references("id").inTable("Users").onDelete("cascade");
        t.timestamp("created_at").defaultTo(knex.raw('current_timestamp'));
    })

    knex.schema.createTable("users_brances", function(t){
        t.integer("user_id").references("id").inTable("users");
        t.integer("branch_in").references("id").inTable("brances");
    });

    knex.schema.table("bookmarks", function(t) {
        t.integer("branch").references("id").inTable("brances".onDelete("cascade"));
    });
};

exports.down = function(knex, Promise) {
    knex.schema.dropTable("branches");
    knex.schema.table("bookmarks", function(t){
        t.dropColumn("branch");
    });
    knex.schema.dropTable("branch_bookmark");
};
