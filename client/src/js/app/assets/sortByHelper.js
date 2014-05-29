/*global require, define */
/*jslint nomen: true, debug: true, bitwise: true, todo: true */

/**
 * @module sortByHelper
 */

define(["handlebars", "utils"],
    /**
     * Handlebars sortBy helper
     * @name module:sortByHelper
     * @requires handlebars {Function} Handlebars
     * @requires utils {Object} Utils
     *
     * @function
     * @returns {function} sortByFn
     */
        function (Handlebars, utils) {
        "use strict";
        var sortByFn = function (list, param, asMethod, withExceptions, opt) {
            var sorted = utils.sortBy(
                    list,
                    param,
                    utils.strictBool(asMethod),
                    utils.strictBool(withExceptions)
                ),
                options = arguments[arguments.length - 1];

            return options && options.fn ?
                    options.fn(sorted) :
                    sorted;
            

        };
        Handlebars.registerHelper("sortBy", sortByFn);
        return sortByFn;
    });