/*global require, define, document, $, console, window */
/*jslint nomen: true, debug: true, bitwise: true, todo: true*/

/**
 * @module mainPack
 */

define([
    "framework",
    "underscore",
    "backbone",
    "handlebars",
    "highcharts",
    "hcadapter",
    "sortable",

    "utils",

    "models/defaultModel",
    "views/defaultView",
    "text!templates/defaultTpl.hbs",

    "views/chartView",
    "views/tableView"

], function () {
    "use strict";
    /**
     * @name module:mainPack
     * @description Dependent modules preload
     * @function
     * @requires framework
     * @requires underscore
     * @requires backbone
     * @requires handlebars
     * @requires sortable
     *
     * @requires module:utils
     * @requires module:defaultModel
     * @requires module:defaultView
     * @requires module:chartView
     * @requires module:tableView
     */

    return true;
});