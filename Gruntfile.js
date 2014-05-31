module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-karma-coveralls');

    grunt.initConfig({
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

    grunt.registerTask('default', ['coveralls']);
};
