({
    baseUrl: "js/app",

    optimize: "uglify2",
    preserveLicenseComments: true,
    generateSourseMaps: true,

    name: "main",
    out: "../dist/js/app/main-cdn.js",

    map: {
        '*': {
            'jquery': 'framework'
        }
    },
    paths: {
        // Bower components
        framework: "empty:",

        backbone: "empty:",
        underscore: "empty:",

        handlebars: "empty:",
        highcharts: "empty:",
        hcadapter: "empty:",
        l10n: "../../bower_components/l10n/l10n",
        sortable: "../../bower_components/sortable/js/sortable",

        // Rjs plugins
        text: "../../bower_components/requirejs-text/text",
        css: "../../bower_components/require-css/css",
        "css-builder": "../../bower_components/require-css/css-builder",
        "normalize": "../../bower_components/require-css/normalize",

        // App components
        assets: "assets",
        views: "views",
        models: "models",
        templates: "templates",
        localization: "localization",
        styles: "../../sass",

        utils: "assets/utils",

        // Aggregated module path
        modules: 'modules',

        // App instance
        App: 'app'
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
        backbone: {
            deps: ['underscore', "framework"],
            exports: "Backbone"
        },
        l10n: {
            exports: "l10n"
        },
        highcharts: {
            deps: ["framework", "hcadapter"],
            exports: "Highcharts"
        }
    }
})