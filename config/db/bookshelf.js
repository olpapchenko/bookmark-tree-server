
var dbConfig = {
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'Ur@n!um824',
        database: 'tree'
    }
}

var knex = require('knex')(dbConfig);
module.exports  = require('bookshelf')(knex);