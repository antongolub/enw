/*global require, define */
/*jslint nomen: true, debug: true, bitwise: true, todo: true */

/**
 * @module ifCondHelper
 */

define(["handlebars"],
    /**
     * Handlebars condition helper
     * @name module:ifCondHelper
     * @requires handlebars {Function} Handlebars
     *
     * @function
     * @returns {function} isEqualFn
     */
    function (Handlebars) {
        "use strict";
        /**
         * @name module:ifCondHelper#isEqualFn
         * @description Provides extended condition logic for HBS templates
         * @memberof module:ifCondHelper
         * @param a1 {*} 1st cond argument
         * @param a2 {*} 2nd cond argument
         * @param options {Object} HBS context
         * @function
         * @inner
         */
        var isEqualFn = function(a1, a2, options) {
			if(a1 === a2) {
				return options.fn(this);
			}
			return options.inverse(this);
		};
        Handlebars.registerHelper('ifCond', isEqualFn);
        return isEqualFn;
    });