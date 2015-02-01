module.exports = function(grunt) {

    var _ = grunt.util._;
    var locales = ["fr"];
    var prodir = 'debug';
    var builddir = 'build/'+prodir;
    var mime = require('mime');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
    
        watch : {
            compass: {
                files: ['compile/css/*.scss'],
                tasks: ['compass:build']
            },
            js: {
                files: ['compile/js/*.js'],
                tasks: ['copy:js']
            },
            copy: {
                files: ['copy/**/*'],
                tasks: ['copy:base']
            },
            translations: {
                files: ['copy/*.html', 'compile/js/*.js'],
                tasks: ['xgettext', 'shell']
            },
            transplant: {
                files: ['translations/*.po'],
                tasks: ['po2jsonEmbed']
            },

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
            },

            js: {
                files: [
                    {
                        expand: true,
                        cwd: 'compile/js', src: ['**'],
                        dest: builddir+'/cdn/js'
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
    	},

		connect: {
		    server: {
		     	options: {
		     		port : 3002,
		     		base : builddir,
			        middleware: function(connect, options, middlewares) {
				        middlewares.unshift(function(req, res, next) {
                            var url = req.originalUrl;
                            if (url.substr(0,5) === '/cdn/') {
			          			var c = builddir+'/'+url;
			          			if (grunt.file.exists(c)) {
                                    // mime type
                                    var type = mime.lookup(url);
                                    if (!res.getHeader('content-type')) {
                                        res.setHeader('Content-Type', type);
                                    }
			          			    res.end(grunt.file.read(c));
                                } else {
                                    res.statusCode = 404;
                                    res.end("");
                                }
			          		} else {
                                res.setHeader('Content-Type', 'text/html; charset=utf-8;');
			            	    res.end(grunt.file.read(builddir+'/index.html'));
                            }
			          	});
                        return middlewares;
			        }
		      	}
		    }
		}

    });
    
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-xgettext');
    grunt.loadNpmTasks('grunt-po2json-embed');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('build', ['clean:build', 'copy:base', 'copy:js', 'compass:build','xgettext','shell:msgmerge','po2jsonEmbed']);

    grunt.registerTask('default', ['build','connect','watch']);
};
