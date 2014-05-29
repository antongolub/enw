/*global require, define, console, $ */
/*jslint nomen: true, debug: true */

/**
 * @module giaExamsView
 * @extends module:examsView
 */


define([
    "views/exams/examsView",
    "models/giaModel",
], function (examsView, Model) {
    "use strict";
    /**
     * @name module:giaExamsView
     * @description examsView GIA extension
     * @class Backbone.View
     * @requires module:examsView
     * @requires module:giaModel
     * @see module:examsView
     * @see module:giaModel
     * @constructor
     * @returns {Function} Backbone.View constructor
     */

    return examsView.extend({
        /**
         * @name module:giaExamsView#title
         * @description GIA exams widget title
         * @type {String}
         */
        title: "giaTitle",
        /**
         * @name module:giaExamsView#ModelConstructor
         * @see module:defaultView#ModelConstructor
         * @see module:giaModel
         * @description GIA exam model class
         */
        ModelConstructor: Model
    });
});