
exports.up = function(knex, Promise) {
    return Promise.all([
    knex.schema.table("rights", function(t){
        t.unique(["user_id", "bookmark_id"]);
    }),
    knex.schema.table("bookmarks_bookmarks", function(t){
        t.unique(["bookmark", "references"]);
    })]),
    knex.schema.table("branches_users", function(t){
        t.unique(["branch_id", "user_id"]);
    })
};

exports.down = function(knex, Promise) {
  
};
