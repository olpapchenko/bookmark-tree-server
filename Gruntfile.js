var exec = require("child_process").exec;

var DB_CONNECTION = {
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'Ur@n!um824',
        database: 'tree'
    }
};

module.exports = function(grunt) {
    grunt.initConfig({
        knexmigrate: {
            config: {
                directory: './config/db/migrate',
                tableName: 'knex_migrations',
                database: DB_CONNECTION
            }
        },
        knexseed: {
            config: {
                directory: './config/db/seeds',
                database: DB_CONNECTION
            }
        },
        browserSync: {
            default_options: {
                bsFiles: {
                    src : [
                        './public/**/*.*',
                        './views/index.html'
                    ]
                },
                options: {
                    port: 1001,
                    watchTask: true,
                    server: './public',
                    proxy: 'localhost:3000'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-knexseed');
    grunt.loadNpmTasks('grunt-knex-migrate');
    grunt.loadNpmTasks('grunt-browser-sync');

    //blocking task
    grunt.registerTask("test", function (action) {
        var done = this.async(),
            errorOccurred = false;
        if(action === "client") {
            grunt.log.writeln("starting app server...");
            var serverProcess = exec("node ./app_main", function (error) {
                if(error) {
                    errorOccurred = true;
                    grunt.log.warn("can not start server");
                    grunt.log.error(error.stack);
                }
            });

            serverProcess.stdout.on("data", function (data) {
                grunt.log.verbose.writeln("app server: " + data);
            });

            serverProcess.stderr.on("data", function (data) {
                grunt.log.error("app server" + data);
            });

            setTimeout(function () {
                if(errorOccurred) {
                    done(false);
                    return;
                }
                grunt.log.ok("server started");
                grunt.log.ok("starting karma...");
                var karmaProcess = exec("karma start ./assets/js/tests/karma.conf.js", function (error) {
                    if(error) {
                        grunt.log.warn("Karma can not be started:");
                        grunt.log.error(error.stack);
                        done(false);
                    }
                });

                karmaProcess.stdout.on("data", function (data) {
                   grunt.log.writeln("karma: " + data);
                });

                karmaProcess.stdout.on("error", function (data) {
                    grunt.log.error("karma: " + data);
                })

            }, 6000);

        } else if (this.target === "stop") {
            if(pid) {
                process.kill(pid);
            }
        }
    });

    grunt.registerTask("setupDB", ['knexmigrate:latest', 'knexseed:run']);
};