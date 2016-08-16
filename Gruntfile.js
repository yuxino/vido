module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            files: ['Gruntfile.js', 'src/vido.js']
        },
        uglify: {
            options: {
                compress: {
                    drop_console: false
                },
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
            },
            my_target: {
                files: {
                    'dest/vido.min.js': ['src/vido.js'],
                    'dest/vue.min.js': ['src/vue.js']
                }
            }
        },
        cssmin: {
            css: {
                src: 'src/vido.css',
                dest: 'dest/vido.min.css'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-css');
    grunt.registerTask('default', ['jshint', 'uglify', 'cssmin']);

};
