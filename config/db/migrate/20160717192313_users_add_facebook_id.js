
exports.up = function(knex, Promise) {
   return knex.schema.table("users", function (t) {
       t.string("facebook_id",40);
   });
};

exports.down = function(knex, Promise) {
    return knex.schema.table("users", function (t) {
        t.dropColumn("facebook_id");
    });
};
