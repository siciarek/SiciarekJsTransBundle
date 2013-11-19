module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            dest: {
                src: [
                    'Resources/public/js/src/String.js',
                    'Resources/public/js/src/PluralizationRules.js',
                    'Resources/public/js/src/Interval.js',
                    'Resources/public/js/src/MessageSelector.js'
                ],
                dest: "Resources/public/js/dist/trans.js"
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %>: <%= pkg.description %> <%= grunt.template.today("yyyy-mm-dd hh:MM") %> */\n'
            },
            build: {
                src: 'Resources/public/js/dist/trans.js',
                dest: 'Resources/public/js/dist/trans.min.js'
            }
        },
        compare_size: {
            files: [
                'Resources/public/js/dist/trans.js',
                'Resources/public/js/dist/trans.min.js'
            ]
        },
        qunit: {
            files: [
                "Resources/public/js/qunit/*.html"
            ]
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            files: [
                'Resources/public/js/src/String.js',
                'Resources/public/js/src/Interval.js',
                'Resources/public/js/src/MessageSelector.js',
                'Resources/public/js/src/PluralizationRules.js',
                '!Resources/public/js/dist/*.min.js'
            ]
        },
        jsdoc : {
            dist : {
                src: ['Resources/public/js/src/*.js', 'README.md'],
                dest: 'Resources/public/js/doc'
            }
        },
        watch: {
            scripts: {
                files: ['**/*.js'],
                tasks: ['jshint'],
                options: {
                    spawn: false
                }
            }
        }
    });

    // Load grunt plugins
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-compare-size');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jsdoc');

    // Default task(s).
    grunt.registerTask('build', ['concat', 'uglify', 'compare_size']);

    // Test task(s).
    grunt.registerTask('test', ['jshint', 'qunit']);

    // Default task(s).
    grunt.registerTask('default', ['build', 'test']);
};