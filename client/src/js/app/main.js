/*global define, require, document, window, $ */
/*jslint nomen: true, debug: true, bitwise: true */

/**
 * @name Elasticnode widgets
 * @description Main widget file: config & initialization
 * @author Anton Golub <mailbox@antongolub.ru>
 * @copyright 2014
 * @license MIT
 * @version 0.0.1
 * @class main
 */



(function () {
    "use strict";
    // Provides feature detection to load zepto or jquery
    var modern = document.querySelector &&
        window.localStorage &&
        window.addEventListener;

    // modern = false;

    require.config({
        map: {
            '*': {
                'jquery': 'framework'
            }
        },
        //baseUrl: 'js/',
        paths: {
            // Bower components
            framework: modern ?
                    [
                        "//cdn.jsdelivr.net/zepto/1.1.3/zepto.min",
                        "//cdnjs.cloudflare.com/ajax/libs/zepto/1.1.3/zepto.min",
                        "../../../bower_components/zepto/zepto"
                    ] :
                    [
                        "//yandex.st/jquery/1.11.0/jquery.min",
                        "//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min",
                        "../../../bower_components/jquery/dist/jquery.min"
                    ],

            backbone: [
                "//yandex.st/backbone/1.1.2/backbone-min",
                "//cdn.jsdelivr.net/backbonejs/1.1.2/backbone-min",
                "//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min",
                "../../../bower_components/backbone/backbone"
            ],
            underscore: [
                "//yandex.st/underscore/1.6.0/underscore-min",
                "//cdn.jsdelivr.net/underscorejs/1.6.0/underscore-min",
                "../../../bower_components/underscore/underscore"
            ],
            handlebars: [
                //"//cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.3.0/handlebars.min",
                //"//cdn.jsdelivr.net/handlebarsjs/1.3.0/handlebars.min",
                "../../../bower_components/handlebars/handlebars"
            ],
            highcharts: [
                //"//cdn.jsdelivr.net/highcharts/4.0.1/highcharts",
                "//cdnjs.cloudflare.com/ajax/libs/highcharts/4.0.1/highcharts",
                "../../../bower_components/highcharts/highcharts"
            ],
            hcadapter: [
                "//cdn.jsdelivr.net/highcharts/4.0.1/adapters/standalone-framework",
                "//cdnjs.cloudflare.com/ajax/libs/highcharts/4.0.1/adapters/standalone-framework",
                "../../../bower_components/highcharts/adapters/standalone-framework"
            ],
            l10n: "../../../bower_components/l10n/l10n",
            sortable: "../../../bower_components/sortable/js/sortable",

            // Rjs plugins
            text: "../../../bower_components/requirejs-text/text",
            css: "../../../bower_components/require-css/css",

            // App components
            assets: "../app/assets",
            views: "../app/views",
            models: "../app/models",
            templates: "../app/templates",
            localization: "../app/localization",
            styles: "../../sass",

            utils: "../app/assets/utils",

            // Aggregated module path
            modules: '../app/modules',

            // App instance
            App: '../app/app'
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
                deps: ["framework", "hcadapter"], //[modern ? "hcadapter" : "framework"],
                exports: "Highcharts"
            },
            backbone: {
                deps: ['underscore', "framework"],
                exports: "Backbone"
            },
            l10n: {
                exports: "l10n"
            }
        }
    });
}());
// Widget class init
define(["App"], function (enw) {
    "use strict";
    var cb,
        cbArray = window.enwCallback;
    window.Enw = enw;

    if (Object.prototype.toString.call(cbArray) === '[object Array]') {
        while (cbArray.length) {
            cb = cbArray.pop();
            try {
                cb();
            } catch (e) {}
        }
    }
});
/*
// Dirty build hack
define("js/app/main", ["main"]);
define("js/app/main-cdn", ["main"]);
define("js/app/main-singlefile", ["main"]);*/


