/*global require, define */
/*jslint nomen: true, todo: true */

/**
 * @module examsModel
 * @extends module:defaultModel
 */


define(['models/defaultModel'],

    /**
     * @name module:examsModel
     * @description "Exams" model (EGE as default)
     * @see module:defaultModel
     * @class Backbone.Model
     * @extends module:defaultModel
     * @constructor
     * @requires module:defaultModel {Function}
     * @returns {Function} Backbone.Model constructor
     */

    function (defaultModel) {
        "use strict";

        return defaultModel.extend({

        /**
        * @property module:examsModel#url {String} API rel path
        * @type {string}
        */
            path: "api/exams/ege"
        });

    });