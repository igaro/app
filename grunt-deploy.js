module.exports = function(grunt) {

    var _ = grunt.util._;
    var locales = ["fr"];
    var prodir = 'deploy';
    var builddir = 'build/'+prodir;
    var mime = require('mime');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
    
        uglify: {
            options: {
                mangle: {
		    except: ['jQuery']
	      	},
                sourceMap : false,
                sourceMapIncludeSources : false
            },
            app: {
                files: [{
                    expand: true,
                    cwd: 'compile/js', src: ['*.js'],
                    dest: builddir+'/cdn/js'
                }]
            }
        },

        clean: {
            build: {
                src: [builddir]
            }
        },

        compass: {
            build: {
                options: {              
                    config: 'compass-'+prodir+'.rb'
                }
            }
        },
        
        copy: {
            base: {
                files: [
                    {
                        expand: true,
                        cwd: 'copy', src: ['**'],
                        dest: builddir+'/'
                    }
                ]
            }
        },

        xgettext: {
            target: {
                files: {
                    html: [builddir+'/**/*.html', builddir+'/**/*.js']
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
                    js : [builddir+'/**/*.html', builddir+'/**/*.js']
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
                       "    msgmerge " + po + " translations/messages.pot > .new.po.tmp\n" +
                       "    exitCode=$?\n" +
                       "    if [ $exitCode -ne 0 ]; then\n" +
                       "        echo \"Msgmerge failed with exit code $?\"\n" +
                       "        exit $exitCode\n" +
                       "    fi\n" +
                       "    mv .new.po.tmp " + po + "\n" +
                       "fi\n";
              }).join("")
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-xgettext');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-po2json-embed');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('build', ['clean:build', 'copy:base', 'uglify:app', 'compass:build','xgettext','shell:msgmerge','po2jsonEmbed']);

    grunt.registerTask('default', ['build']);
};
