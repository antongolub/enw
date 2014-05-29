/*global require, define */
/*jslint nomen: true, debug: true, bitwise: true, todo: true */

/**
 * @module localizationHelper
 */

define([
    "handlebars",
    "framework",
    "l10n",
    "text!localization/localization.json"
],
    /**
     * @description Handlebars localization helper
     * @name module:localizationHelper
     * @requires handlebars {Function} Handlebars
     * @requires framework {Function} jQuery or Zepro
     * @requires l10n {Function} Localization lib
     * @requires text!localization/localization {JSON} Localization JSON file
     * @example <div>{{l10n myVar}}</div>
     *
     * @function
     * @returns {function} localizationFn
     */
        function (Handlebars, $, l10n, dictionary) {
        "use strict";

        // TODO Lang sets should be separated
        String.toLocaleString($.parseJSON(dictionary));
        /**
         * @name module:localizationHelper#localizationFn
         * @description Provides localization for HBS templates
         * @memberof module:localizationHelper
         * @param str {String} string to be localized
         * @param [options] {Object} HBS context
         * @function
         * @inner
         */
        var localizationFn = function (str, options) {
            str = (str+"").toLocaleString();
            return options && options.fn ?
                    options.fn(str) :
                    str;
        };

        Handlebars.registerHelper('l10n', localizationFn);
        return localizationFn;
    });