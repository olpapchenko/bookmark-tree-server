
exports.up = function(knex, Promise) {
    return knex.schema.renameTable('branches_bookmarks', 'bookmarks_branches');
};

exports.down = function(knex, Promise) {
    return knex.schema.renameTable('bookmarks_branches', 'branches_bookmarks');
};
