
var dbConfig = {
    client: 'pg',
    connection: {
        host     : '127.0.0.1',
        user     : 'postgres',
        password : 'tree',
        database : '31107548'
    }
}

var knex = require('knex')(dbConfig);
module.exports  = require('bookshelf')(knex);