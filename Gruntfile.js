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
                banner: '/*! <%= pkg.name %>: <%= pkg.description %> <%= grunt.template.today("yyyy-mm-dd hh:MM") %> *//n'
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
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },
        nodeunit: {
            all: {
                src: [
                    'Resources/public/js/nodeunit/tests/*.js'
                ]
            }
        },
        shell: {
            nutap: {
                command: 'node ./node_modules/grunt-contrib-nodeunit/node_modules/nodeunit/bin/nodeunit --reporter tap Resources/public/js/nodeunit/tests/trans.js',
                options: {
                    stdout: true,
                    stderr: true,
                    failOnError: false,
                    warnOnError: true
                }
            }
        }
    });

    // Load grunt plugins.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-compare-size');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-shell');

    // Default task(s).
    grunt.registerTask('build', ['concat', 'uglify', 'compare_size']);

    // Test task(s).
    grunt.registerTask('test', ['jshint', 'qunit']);

    // Default task(s).
    grunt.registerTask('default', ['build', 'test']);
};