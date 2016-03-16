var dbConf = require("./dbConf");
 

var knex = require('knex')(dbConf);
module.exports  = require('bookshelf')(knex).plugin('registry');