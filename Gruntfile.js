module.exports = function(grunt) {
    grunt.initConfig({
        knexmigrate: {
            config: {
                directory: './config/db/migrate',
                tableName: 'knex_migrations',
                database: {
                    client: 'pg',
                    connection: {
                        host: '127.0.0.1',
                        user: 'postgres',
                        password: 'Ur@n!um824',
                        database: 'tree'
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-knex-migrate');
};