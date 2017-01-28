
exports.up = function(knex, Promise) {
    return Promise.all(
        [knex.schema.createTable("branches", function (t) {
        t.increments("id").primary();
        t.integer("branch_id").references("id").inTable("branches").onDelete("cascade");
        t.text("name").notNull();
        t.timestamp("created_at").defaultTo(knex.raw('current_timestamp'));
    }),

    knex.schema.createTable("branches_users", function(t){
        t.integer("user_id").references("id").inTable("users").onDelete("cascade");
        t.integer("branch_id").references("id").inTable("branches").onDelete("cascade");
    }),

    knex.schema.table("bookmarks", function(t) {
        t.integer("branch_id").references("id").inTable("branches").onDelete("cascade");
    })]);
};

exports.down = function(knex, Promise) {
  return  Promise.all([ knex.schema.dropTable("branches"),
    knex.schema.table("bookmarks", function(t){
        t.dropColumn("branch_id");
    }),
    knex.schema.dropTable("branch_bookmark")]);
};
