module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
    
        watch : {
            compass_app: {
                files: ['compile/css/*.scss'],
                tasks: ['compass:app']
            },
            js_app: {
                files: ['compile/js/*.js'],
                tasks: ['uglify:app']
            },
            copy_app: {
                files: ['copy/**/*'],
                tasks: ['copy:app']
            }
        },

        compass: {
            app: {
                options: {              
                    config: 'compass-deploy.rb'
                }
            }
        },
        
        uglify: {
            options: {
                mangle: false,
		        sourceMap : false,
                sourceMapIncludeSources : false
                //warnings:true
            },
            app: {
                files: [{
                    expand: true,
                    cwd: 'compile/js', src: ['*.js'],
                    dest: 'output/deploy/cdn/js'
                }]
            }
        },

        copy: {
            app: {
                files: [
                    {
                        expand: true,
                        cwd: 'copy/', src: ['**'],
                        dest: 'output/deploy'
                    }
                ]
            }
        }
    
    });
    
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    
    grunt.registerTask('default', ['compass:app', 'uglify:app' , 'copy:app', 'watch']);

};
