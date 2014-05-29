/*global require, define, console */
/*jslint nomen: true, debug: true */

/**
 * @module souView
 * @extends module:defaultView
 */

define([
    "views/defaultView",
    "views/sou/souChartView",
    "text!templates/defaultTpl.hbs",
    "models/souModel",
    "framework",
    "utils"

], function (defaultView, SouChartView, tpl, Model, $, utils) {
    "use strict";
    /**
     * @name module:souView
     * @description SOU widget class
     * @class Backbone.View
     *
     * @requires module:defaultView
     * @requires module:souChartView
     * @requires text!templates/souTpl {String} SOU hbs template
     * @requires module:souModel
     *
     * @see module:defaultView
     * @see module:souChartView
     * @see module:souModel
     *
     * @constructor
     * @returns {Function} Backbone.View constructor
     */

    return defaultView.extend({
        /**
         * @name module:souView#template
         * @dectription Raw handlebars template
         * @property {String}
         */
        template: tpl,

        /**
         * @name module:souView#name
         * @dectription Template id (need for caching)
         * @property {String}
         */
        name: "souTpl",

        /**
         * @name module:souView#title
         * @dectription Default SOU widget title
         * @property {String}
         */
        title: "souTitle",

        /**
         * @name module:souView#ModelConstructor
         * @see module:defaultView#ModelConstructor
         * @dectription SOU model class
         * @construstor {String}
         */
        ModelConstructor: Model,

        /**
         * @name module:souView#renderData
         * @description SOU chart data update $ widget menu render
         * @function
         */
        renderData: function () {
            // Menu render
            /* istanbul ignore else */
            if (this.renderMenu) {
                this.renderMenu(["avg"].concat(this.model.get("unique") || []));
                // There's no need to render another one;
                this.renderMenu = undefined;
            }
            /* istanbul ignore else */
            if (this.chartView) {
                this.chartView.render(this.model.get("collection"), this.model.get("subtype"));
            }
            this.switchModeDelayed();
            this.showMsg();

            return this.model.attributes;
        },
        /**
         * @name module:souView#afterRender
         * @description Menu event bindings and SOU chart initialization
         * @see module:defaultView#afterRender
         * @function
         */
        afterRender: function () {
            var MENU_LINK_CLASSNAME = ".enw__menu__link",
                CHART_CLASSNAME = ".enw__chart";

            this.$el.on(
                "click",
                MENU_LINK_CLASSNAME,
                $.proxy(this.onMenuClick, this)
            );

            // Chart view init
            this.chartView = new SouChartView({
                el: this.$el.find(CHART_CLASSNAME).get(0)
            });
        },
        /**
         * @name module:souView#onMenuClick
         * @description Menu click handler
         * @function
         */
        onMenuClick: function (e) {
            var $target = $(e.target),
                mode = $target.data("href");

            // "Throttling": suspends handler while previous data request is being proceed
            if (this.status === 2) {
                this.switchMode(mode);
                return mode;
            }
            return;
        },
        /**
         * @name module:souView#switchMode
         * @description Updates model state by selected mode
         * @param [mode] {String} Widget state
         */
        switchMode: function (mode) {
            // "avg" mode has empty subtype
            var subject = (!mode || mode === "avg" ? "" : "/" + mode),
                model = this.model,
                /**
                 * @see module:defaultModel#url
                 */
                url = model.host + "/" + model.path + subject,
                MENU_SELECTOR = ".enw__menu";

            // Menu item class toggle
            this.selectMenuItem(mode, this.$el.find(MENU_SELECTOR));

            this.fetch(url);

            return mode;
        }
    });
});