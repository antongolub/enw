/*global require, define, console, $ */
/*jslint nomen: true, debug: true */

/**
 * @module populationView
 * @extends module:defaultView
 */


define([
    "framework",
    "views/defaultView",
    "text!templates/populationTpl.hbs",
    "models/populationModel",
    "underscore",
    "utils",
    "views/population/populationAvgChartView",
    "views/population/populationYearChartView"

], function ($, defaultView, tpl, Model, _, utils, avgChartView, yearChartView) {
    "use strict";
    /**
     * @name module:populationView
     * @description Population informer
     * @class Backbone.View
     *
     * @requires module:defaultView
     * @requires module:populationModel
     * @requires text!templates/populationTpl {String} Population hbs template
     * @requires underscore
     * @requires module:utils
     * @requires module:populationAvgChartView
     * @requires module:populationYearChartView
     *
     * @see module:defaultView
     * @see module:utils
     * @see module:populationModel
     * @see module:populationYearChartView
     * @see module:populationYearChartView
     *
     * @constructor
     * @returns {Function} Backbone.View constructor
     */

    var MENU_CLASS = ".enw__menu";

    return defaultView.extend({
        /**
         * @name module:populationView#template
         * @description Raw handlebars template
         * @type {String}
         */
        template: tpl,

        /**
         * @name module:populationView#name
         * @description Template id
         * @type {String}
         */
        name: "populationTpl",

        /**
         * @name module:populationView#title
         * @description Default widget title
         * @type {String}
         */
        title: "populationTitle",

        /**
         * @name module:populationView#ModelConstructor
         * @see module:defaultView#ModelConstructor
         * @see module:populationModel
         * @description Population model class
         */
        ModelConstructor: Model,

        /**
         * @name module:populationView#mode
         * @description Current widget mode
         * @type {object}
         */
        mode: {
            year: "avg"
        },

        /**
         * @name module:populationView#renderData
         * @description Chart update & widget menu render
         * @function
         */
        renderData: function () {
            var collection = this.model.get("collection"),
                relatedView = this.getRelatedView();

            /* istanbul ignore else */
            if (this.renderMenu) {
                // Getting unique years from model
                this.renderMenu(
                    ["avg"].concat(_.uniq(_.pluck(collection, 'year'))),
                    MENU_CLASS
                );

                // There's no need to render another one;
                this.renderMenu = undefined;
            }

            //this.switchModeDelayed();
            this.showMsg();

            // Foolproof
            /* istanbul ignore else */
            if (relatedView) {
                relatedView.render(collection || this.model.get("population"));
                this.switchRelatedView(relatedView.$el);
            }
            return this.model.attributes;
        },
        /**
         * @name module:populationView#afterRender
         * @description Menu event bindings
         * @see module:defaultView#afterRender
         * @function
         */
        afterRender: function () {
            var MENU_LINK_SELECTOR = ".enw__menu__link";

            this.$el.on(
                "click",
                MENU_LINK_SELECTOR,
                $.proxy(this.onMenuClick, this)
            );
        },
        /**
         * @name module:populationView#getRelatedView
         * @description Gets related view by widget mode
         * @function
         */
        getRelatedView: function () {
            var mode = this.mode,
                SELECTOR,
                hash,
                // View constructor
                View;

            if (mode.year === "avg") {
                hash = "avgChart";
                SELECTOR = ".avgChart";
                View = avgChartView;
            } else {
                hash = "yearChart";
                SELECTOR = ".yearChart";
                View = yearChartView;
            }

            // Delayed chart initialization
            return this.initRelatedView(hash, View, SELECTOR);

        },
        /**
         * @name module:populationView#onMenuClick
         * @description Primary and secondary menu click handler.
         * Switches widget mode by click
         * @function
         */
        onMenuClick: function (e) {
            var $target = $(e.target),
                mode = $target.data("href");

            // "Throttling": suspends handler while previous data request is being proceed
            /* istanbul ignore else */
            if (this.status === 2) {
                // Part of switchMode logic
                // this.selectMenuItem($target);

                this.switchMode(mode);
            }
            return mode;
        },
        /**
         * @name module:populationView#switchMode
         * @description Updates model state by selected mode
         * @function
         * @param [year] {String|Number} Year in xxxx format
         */
        switchMode: function (year) {
            var mode = this.setMode(year),
                model = this.model,
                url = model.host + "/" + model.path;

            /* istanbul ignore else */
            if (mode) {

                // Menu class switch
                this.selectMenuItem(mode.year, this.$el.find(MENU_CLASS));

                // NB: As far as we have no pre-initialized related views
                // DOM state may be switched in renderData callback only
                // So we just form the request and wait. DDP as is.

                /* istanbul ignore else */
                if (mode.year !== "avg") {
                    url += "/" + mode.year;
                }
                this.fetch(url);
            }
            return mode;
        }
    });
});