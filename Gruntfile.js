var exec = require("child_process").exec;
var fs = require("fs");

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
        },
        copy: {
            main: {
                expand: true,
                src: "vendor/*",
                dest: "./public/js/",
                cwd: "./assets/js/"
            }
        },
        requirejs: {
            compile: {
                options: {
                    dir: "./public/js",
                    baseUrl: "./assets/js/app",
                    optimize: "uglify",
                    paths: {
                        "underscore": "../vendor/underscore/underscore-min",
                        "angular": "../vendor/angular/angular",
                        "ocLazyLoad": "../vendor/oclazyload/dist/ocLazyLoad",
                        "angular-drag-and-drop-lists": "../vendor/angular-drag-and-drop-lists/angular-drag-and-drop-lists",
                        "angular-ui-router": "../vendor/angular-ui-router/release/angular-ui-router",
                        "ng-file-upload-all" : "../vendor/ng-file-upload/ng-file-upload-all",
                        "ngProgress": "../vendor/ngprogress/build/ngprogress.min",
                        "jquery": "../vendor/jquery/jquery.min",
                        "toaster": "../vendor/toaster/toaster.min",
                        "ngDialog": "../vendor/ngDialog/js/ngDialog.min",
                        "moment": "../vendor/moment/moment",
                        "moment-timezone-with-data": "../vendor/moment-timezone/builds/moment-timezone-with-data",
                        "moment-timezone-with-data-2010-2020": "../vendor/moment-timezone/builds/moment-timezone-with-data-2010-2020",
                        "bootstrap": "../vendor/bootstrap/dist/js/bootstrap.min",
                        "jquery.backstretch": "../vendor/jquery-backstretch/jquery.backstretch"
                    },
                    modules: [
                        {
                            name: "./config.route"
                        }
                    ]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-knexseed');
    grunt.loadNpmTasks('grunt-knex-migrate');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-copy');


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

    grunt.registerTask("createDirs", function () {
        var dirsToCreate = ["./logs", "./sessions", "./uploads", "./uploads/avatars", "./uploads/screenshots"];
        dirsToCreate.forEach(function (dir) {
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir);
            }
        });
    });

    grunt.registerTask("copyCustomVendorCode", function () {
        fs.createReadStream('./app/vendorCustom/bookshelf/registry.js').pipe(fs.createWriteStream('./node_modules/bookshelf/plugins/registry.js'));
        fs.createReadStream('./app/vendorCustom/mincer/manifest.js').pipe(fs.createWriteStream('./node_modules/mincer/lib/mincer/manifest.js'));
    });

    grunt.registerTask("setupDB", ['knexmigrate:latest']);
    grunt.registerTask("deploy", ['createDirs', 'copyCustomVendorCode', 'setupDB', "requirejs", "copy"]);
};