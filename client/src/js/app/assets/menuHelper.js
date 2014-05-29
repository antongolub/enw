/*global require, define */
/*jslint nomen: true, debug: true, bitwise: true, todo: true */

/**
 * @module menuHelper
 */

define([
    "handlebars",
    "text!templates/partials/menu.hbs",

    "assets/localizationHelper",
    "assets/sortByHelper"
],
    /**
     * @description Handlebars menu render helper
     * @name module:menuHelper
     * @requires handlebars {Function} Handlebars
     * @requires text!templates/partials/menu {String} Handlebars template
     * @requires module:localizationHelper
     * @requires module:sortByHelper
     * @function
     */
        function (Handlebars, template) {
        "use strict";


        Handlebars.registerPartial("menu", template);
    });