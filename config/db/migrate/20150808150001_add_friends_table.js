
exports.up = function(knex, Promise) {
    return knex.schema.createTable("friends", function(t){
        t.integer("user_id").notNull().references("id").inTable("users").onDelete("cascade");
        t.integer("friend_id").notNull().references("id").inTable("users").onDelete("cascade");
        t.unique(["user_id", "friend_id"]);
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("friends");
};
