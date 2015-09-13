
exports.up = function(knex, Promise) {
    return knex.schema.table("branch_rights", function(t){
        t.increments("id").primary();
    })
};

exports.down = function(knex, Promise) {
   return knex.schema.table("branch_rights", function (t){
       t.dropColumn("id");
   })
};
