/*global require, define */
/*jslint nomen: true, todo: true */

/**
 * @module populationModel
 */


define(['models/defaultModel'],

    /**
     * @name module:populationModel
     * @description Population model
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
        * @property module:populationModel#url {String} API rel path
        * @type {string}
        */
            path: "api/stats/population"
        });

    });