module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-coveralls');

    grunt.initConfig({
        coveralls: {
            options: {
                // LCOV coverage file relevant to every target
                src: 'coverage/**/lcov.info',

                // When true, grunt-coveralls will only print a warning rather than
                // an error, to prevent CI builds from failing unnecessarily (e.g. if
                // coveralls.io is down). Optional, defaults to false.
                force: true
            }
        }
    });

    grunt.registerTask('default', ['coveralls']);
};
