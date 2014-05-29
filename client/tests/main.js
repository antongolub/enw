/*globals require, window, console */


// load all files with filename before extension ending in "Test" as tests
var tests = [], file;
for (file in window.__karma__.files) {
    if (/Test\.js$/.test(file)) {
        tests.push(file);
    }
}


//console.log(window.__karma__.files);
console.log('Tests to be started:', tests);
require.config({
    // Karma serves files from '/base'
    baseUrl: '/base',
    map: {
        '*': {
            'jquery': 'framework'
        }
    },
    paths: {
        // Bower components
        //framework: "src/bower_components/zepto/zepto",
        framework: "src/bower_components/jquery/dist/jquery",
        backbone: "src/bower_components/backbone/backbone",
        underscore: "src/bower_components/underscore/underscore",
        handlebars: "src/bower_components/handlebars/handlebars.min",
        highcharts: "src/bower_components/highcharts/highcharts",
        hcadapter: "src/bower_components/highcharts/adapters/standalone-framework",
        l10n: "src/bower_components/l10n/l10n",
        sortable: "src/bower_components/sortable/js/sortable",

        // Rjs plugins
        text: "src/bower_components/requirejs-text/text",
        css: "src/bower_components/require-css/css",

        // App components
        assets: "src/js/app/assets",
        views: "src/js/app/views",
        models: "src/js/app/models",
        templates: "src/js/app/templates",
        localization: "src/js/app/localization",
        styles: "src/sass",

        utils: "src/js/app/assets/utils",

        // Aggregated module path
        modules: 'src/js/app/modules',

        // App instance
        App: 'src/js/app/app'
    },
    shim: {
        framework: {
            exports: "$"
        },
        underscore: {
            exports: "_"
        },
        handlebars: {
            exports: "Handlebars"
        },
        highcharts: {
            deps: ["hcadapter", "framework"],
            exports: "Highcharts"
        },
        backbone: {
            deps: ['underscore', "framework"],
            exports: "Backbone"
        },
        l10n: {
            exports: "l10n"
        }
    },

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});