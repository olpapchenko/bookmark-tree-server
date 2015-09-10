
exports.up = function(knex, Promise) {
    return Promise.all([knex.schema.table("rights", function(t){
        t.boolean("owner");
    }),
    knex.schema.table("branches_users", function(t){
        t.boolean("owner");
    })]);
};

exports.down = function(knex, Promise) {
    return Promise.all([knex.schema.table("rights", function(t){
        t.dropColumn("owner");
    }),
    knex.schema.table("branches_users", function(t){
        t.dropColumn("owner");
    })]);
};
