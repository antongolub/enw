/*globals module*/


// Karma configuration
// Generated on May 5 2014 09:20:02 GMT+0400

module.exports = function (config) {
    "use strict";
    config.set({

        plugins: [
            'karma-requirejs',
            'karma-jasmine',
            'karma-qunit',
            'karma-coverage',
            'karma-phantomjs-launcher',
            'karma-chrome-launcher',
            'karma-ie-launcher',
            'karma-jshint',
            'karma-html-reporter'
        ],


        // base path, that will be used to resolve files and exclude
        basePath: './',

        frameworks: ['jasmine', 'requirejs'],

        // list of files / patterns to load in the browser
        files: [
            //application files

            {pattern: 'src/bower_components/**/*.js', included: false},
            {pattern: 'src/bower_components/**/**/*.*', included: false},
            {pattern: 'src/sass/*.css', included: false},
            {pattern: 'src/js/**/localization/localization.json', included: false},

            {pattern: 'src/js/**/*.js', included: false},
            {pattern: 'src/js/**/**/*.js', included: false},
            {pattern: 'src/js/**/**/**/*.js', included: false},

            {pattern: 'src/js/app/templates/*.hbs', included: false},
            {pattern: 'src/js/app/templates/**/*.hbs', included: false},


            //tests itself
            {pattern: 'tests/_helpers/*.*', included: false},
            {pattern: 'tests/*Test.js', included: false},
            {pattern: 'tests/**/*Test.js', included: false},

            'tests/main.js'
        ],


        // list of files to exclude
        exclude: [
            'src/js/app/main.js'
        ],

        jshint: {
            options: {
                evil: true,
                globals: {
                    $: true,
                    browser: true,
                    window: true,
                    console: true
                }
            },
            summary: true
        },

        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['progress', 'coverage', 'html'],

        preprocessors: {
            'src/js/app/**/**/*.js': ['jshint', 'coverage']
        },
        htmlReporter: {
            outputDir: 'unit_reports'//,
            //templatePath: __dirname+'/jasmine_template.html'
        },
        // optionally, configure the reporter
        coverageReporter: {
            type: 'lcov',
            //type: 'html',
            dir: 'coverage/'
        },

        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true, //false,


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['PhantomJS'],
        //browsers: ['IE'],


        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,


        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false


    });
};
