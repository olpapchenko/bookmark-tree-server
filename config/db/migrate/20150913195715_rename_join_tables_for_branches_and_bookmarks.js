
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.renameTable("rights", "bookmark_rights"),
        knex.schema.renameTable("branches_users", "branch_rights")]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.renameTable("bookmark_rights", "rights"),
        knex.schema.renameTable("branch_rights", "branches_users")]);
};
