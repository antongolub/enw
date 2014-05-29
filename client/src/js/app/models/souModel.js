/*global require, define */
/*jslint nomen: true, todo: true */

/**
 * @module souModel
 */


define(['models/defaultModel'],

    /**
     * @name module:souModel
     * @description "SOU" model
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
        * @property module:souModel#url {String} API rel path
        * @type {string}
        */
            path: "api/stats/sou"
        });

    });