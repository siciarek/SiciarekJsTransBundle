module.exports = function (grunt) {

    'use strict';

    var pkg = grunt.file.readJSON('package.json');

    // Project configuration.
    grunt.initConfig({
        pkg: pkg,
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
                'Gruntfile.js',
                'Resources/public/js/src/String.js',
                'Resources/public/js/src/Interval.js',
                'Resources/public/js/src/MessageSelector.js',
                'Resources/public/js/src/PluralizationRules.js',
                '!Resources/public/js/dist/*.min.js'
            ]
        },
        jsdoc: {
            dist: {
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

    // Load grunt plugins.
    for (var plugin in pkg.devDependencies) {
        if (plugin !== 'grunt' && pkg.devDependencies.hasOwnProperty(plugin)) {
            grunt.loadNpmTasks(plugin);
        }
    }

    // Default task(s).
    grunt.registerTask('build', ['concat', 'uglify', 'compare_size']);

    // Test task(s).
    grunt.registerTask('test', ['jshint', 'qunit']);

    // Default task(s).
    grunt.registerTask('default', ['build', 'test']);
};