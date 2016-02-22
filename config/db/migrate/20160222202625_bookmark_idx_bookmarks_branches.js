
exports.up = function(knex, Promise) {
    return knex.schema.raw("CREATE INDEX bookmark_id_bookmarks_branches_idx ON bookmarks_branches(bookmark_id);");

};

exports.down = function(knex, Promise) {
    return knex.schema.raw("DROP INDEX bookmark_id_bookmarks_branches_idx;");
};
