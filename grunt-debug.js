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
                tasks: ['copy:js']
            },
            copy_app: {
                files: ['copy/**/*'],
                tasks: ['copy:app']
            }
        },

        compass: {
            app: {
                options: {              
                    config: 'compass-debug.rb'
                }
            }
        },
        
        copy: {

            app: {
                files: [
                    {
                        expand: true,
                        cwd: 'copy', src: ['**'],
                        dest: 'output/debug/'
                    }
                ]
            },

            js: {
                files: [
                    {
                        expand: true,
                        cwd: 'compile/js', src: ['**'],
                        dest: 'output/debug/cdn/js'
                    }
                ]
            }
        }

    });
    
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['compass:app', 'copy:app', 'copy:js', 'watch']);
};
