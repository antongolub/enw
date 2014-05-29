/*jslint nomen: true */
/*globals require, define, $*/

/**
 * @module defaultModel
 */

define(['backbone', "framework"], function (Backbone, $) {
    "use strict";
    /**
     * @name module:defaultModel
     * @description CORS capable Backbone.Model class
     * @extends Backbone.Model
     * @class Backbone.Model
     * @requires Backbone
     * @requires jQuery
     * @constructor
     * @returns {Function} Backbone.Model constructor
     */


    $.support.cors = true;

    // BB.sync injection
    (function () {
        var proxiedSync = Backbone.sync;
        Backbone.sync = function (method, model, options) {
            options = $.extend({}, options);

            /* istanbul ignore else */
            if (!options.crossDomain) {
                options.crossDomain = true;
            }

            /* istanbul ignore else */
            if (!options.xhrFields) {
                options.xhrFields = {withCredentials: true};
            }
            return proxiedSync(method, model, options);
        };
    }());

    return Backbone.Model.extend({
        /**
         * @name module:defaultModel#initialize
         * @description Constructs instance URL by path & host params from mixin
         * @function
         */
        initialize: function () {
            this.instanceUrl = this.host + "/" + this.path;
        },
        /**
         * @name module:defaultModel#url
         * @description Returns actual model URL
         * Full URL may be constructed at model init stage only: it depends from host attribute,
         * which is added via custom model extension
         * @function
         * @returns {string} Model instance url
         */
        url: function () {
            return this.instanceUrl;
        }
    });
});