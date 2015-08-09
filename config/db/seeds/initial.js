var encodeSHA = require("../../../app/helpers/encodeSHA");


exports.seed = function(knex, Promise) {
  return Promise.join(

    //truncate tables
    knex('users').del(),
    knex('bookmarks').del(),
    knex('branches').del(),
    knex('notifications').del(),
    knex('markers').del(),
    knex('comments').del(),

    //restart sequences
    knex.raw('alter sequence users_id_seq restart'),
    knex.raw('alter sequence branches_id_seq restart'),
    knex.raw('alter sequence comments_id_seq restart'),
    knex.raw('alter sequence markers_id_seq restart'),
    knex.raw('alter sequence notifications_id_seq restart'),
    knex.raw('alter sequence bookmarks_id_seq restart'),

    Promise.map([{table:"users",
                  data:{name: 'Oleksandr',
                  mail: "olpapchenko@gmail.com",
                  password: encodeSHA("123123"),
                  about: "Just another account"}},
      {table: "branches_users", data:{user_id: 1, branch_id: 1}},
      {table: "bookmarks", data:{name: "Seed bookmark", url: "test url", branch_id: 1}},
      {table: "rights",data:{bookmark_id: 1, user_id: 1, read: true, write: true}},
      {table: "comments",data:{bookmark_id: 1,text: "comment", selector: "some selector", x: 100, y: 50, visible: true}},
      {table: "markers",data:{bookmark_id: 1, marker: "marker", selector: "/asd/dff/f"}},
      {table: "notifications", data:{type: 1, user_id: 1}},
      {table: "bookmarks", data:{name: "Seed bookmark", url: "test url", branch_id: 1}},
      {table: "branches", data:{name: "Branch name"}}

    ], function(options){
      console.log("run " + options.table);
      return knex(options.table).insert(options.data)
    }, {concurrency: 1}));
};
