
module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-karma-coveralls');

    grunt.initConfig({
        replace: {
            coverage: {
                options: {
                    patterns: [
                        {
                            match: /\.\/src/g,
                            replacement: './client/src/'
                        }
                    ]
                },
                files: [
                    {
                        src: ['client/coverage/**/lcov.info'],
                        dest: './'
                    }
                ]
            },
            pathfix: {
                options: {
                    patterns: [
                        {
                            match: /"main",/g,
                            replacement: ''
                        }
                    ]
                },
                files: [
                    {
                        src: ['client/dist/js/app/main*.js'],
                        dest: './'
                    }
                ]
            }
        },
        coveralls: {
            options: {
                debug: true,
                coverage_dir: 'client/coverage/',
                dryRun: true,
                force: true,
                recursive: true
            }
        }
    });
    grunt.registerTask('default', ['replace', 'coveralls']);
};