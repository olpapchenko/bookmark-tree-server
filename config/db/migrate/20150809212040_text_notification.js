
exports.up = function(knex, Promise) {
   return  knex.schema.table("notifications", function(t){
        t.dropColumn("type");
        t.string("message", 100);
    })
};

exports.down = function(knex, Promise) {
  
};
