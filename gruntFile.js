module.exports = function(grunt) {

    var _ = grunt.util._;
    var locales = ["fr"];
    var stagingDir = '.staging';
    var buildDirs  = ['build/debug','build/deploy'];
    var beginPort = 3006;
    var config = {
        pkg: grunt.file.readJSON('package.json'),

        watch : {
            changes: {
                files: ['sass/**/*','compile/**/*','copy/**/*','translations/*.po'],
                tasks: ['build']
            }
        },

        clean: {
            build: {
                src: buildDirs.concat(stagingDir)
            }
        },

        compass: {
            build: {
                options: {
                    config: 'compass.rb'
                }
            }
        },

        uglify: {
            options: {
                mangle: {
                    except: ['jQuery']
                },
                sourceMap: false,
                sourceMapIncludeSources : false
            },
            app: {
                files: [{
                    expand: true,
                    cwd: stagingDir,
                    src: ['**/*.js'],
                    dest: stagingDir
                }]
            }
        },

        copy: {

            stage: {
                files: [
                    {
                        expand: true,
                        cwd: 'compile',
                        src: ['**'],
                        dest: stagingDir
                    }
                ]
            },

            pre: {
                files: [
                    {
                        expand: true,
                        cwd: stagingDir,
                        src: ['**'],
                        dest: buildDirs[0]
                    }
                ]
            },

            post: {
                files: [
                    {
                        expand: true,
                        cwd: stagingDir,
                        src: ['**'],
                        dest: buildDirs[1]
                    }
                ]
            }
        },

        xgettext: {
            target: {
                files: {
                    html: [stagingDir+'/**/*.html', stagingDir+'/**/*.js']
                },
                options: {
                    functionName: '_tr',
                    potFile: 'translations/messages.pot'
                }
            }
        },

        po2jsonEmbed: {
            target: {
                files : {
                    js : [stagingDir+'/**/*.html', stagingDir+'/**/*.js']
                },
                options: {
                    functionName: '_tr',
                    poFiles: 'translations',
                }
            }
        },

        shell: {
            options: {
              failOnError: true
            },
            msgmerge: {
                // todo: dynamic po file list would be better
              command: _.map(locales, function(locale) {
                var po = "translations/" + locale + ".po";
                return "if [ -f \"" + po + "\" ]; then\n" +
                       "    echo \"Updating " + po + "\"\n" +
                       "    msgmerge -v " + po + " translations/messages.pot > .new.po.tmp\n" +
                       "    exitCode=$?\n" +
                       "    if [ $exitCode -ne 0 ]; then\n" +
                       "        echo \"Msgmerge failed with exit code $?\"\n" +
                       "        exit $exitCode\n" +
                       "    fi\n" +
                       "    mv .new.po.tmp " + po + "\n" +
                       "fi\n";
              }).join("")
            }
        },

        connect: {}
    };

    buildDirs.forEach(function(k,i) {

        config.copy.post.files.push({
            expand: true,
            cwd: 'copy', src: ['**'],
            dest: k
        });

        config.connect[k] = {
            options: {
                port : beginPort+i,
                keepalive : grunt.option('keepalive') === 1,
                base : k,
                middleware: function(connect, options, middlewares) {
                    middlewares.unshift(function(req, res, next) {
                        var url = req.originalUrl,
                            attr = url.substr(0,5);
                        if (/(cdn|res)/.test(attr)) {
                            var c = k+'/'+url;
                            if (grunt.file.exists(c))
                                return next();
                            res.statusCode = 404;
                            res.end("");
                        } else {
                            res.setHeader('Content-Type', 'text/html; charset=utf-8;');
                            res.end(grunt.file.read(k+'/index.html'));
                        }
                    });
                    return middlewares;
                }
            }
        };

    });

    grunt.initConfig(config);

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-xgettext');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-po2json-embed');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('build', ['clean:build','copy:stage','xgettext','shell:msgmerge','po2jsonEmbed','compass:build','copy:pre','uglify:app','copy:post']);

    grunt.registerTask('default', ['build','connect','watch']);
};
