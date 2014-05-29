/*global require, define */
/*jslint nomen: true, debug: true, bitwise: true, todo: true */

/**
 * @module titleHelper
 */

define([
    "handlebars",
	"utils",
    "text!templates/partials/title.hbs",

	"assets/ifCondHelper",
    "assets/localizationHelper"
],
    /**
     * Handlebars title render helper
     * @name module:titleHelper
     * @requires handlebars {Function} Handlebars
	 * @requires utils {Object} Utils
     * @requires text!templates/partials/menu {String} Handlebars template
     * @function
	 * @returns {Object} Compiled title template
     */
        function (Handlebars, utils, template) {
        "use strict";

		return utils.getFromCache("titleTpl") || utils.setToCache("titleTpl", Handlebars.compile(template));

    });