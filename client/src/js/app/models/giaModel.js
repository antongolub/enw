/*global require, define */
/*jslint nomen: true, todo: true */

/**
 * @module giaModel
 * @extends module:defaultModel
 */


define(['models/defaultModel'],

    /**
     * @name module:giaModel
     * @description GIA model
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
        * @property module:giaModel#url {String} API rel path
        */
            path: "api/exams/gia"
        });

    });