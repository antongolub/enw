
module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-karma-coveralls');

    grunt.initConfig({
        replace: {
            dist: {
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
            }
        },
        coveralls: {
            options: {
                debug: true,
                coverage_dir: 'client/coverage/',
                dryRun: false,
                force: true,
                recursive: true
            }
        }
    });
    grunt.registerTask('default', ['replace', 'coveralls']);
};
