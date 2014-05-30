/*global require, define, console, $ */
/*jslint nomen: true, debug: true */

/**
 * @module examsView
 * @extends module:defaultView
 */


define([
    "framework",
    "views/defaultView",
    "text!templates/exams/examsTpl.hbs",
    "models/examsModel",
    "underscore",
    "utils",
    "views/exams/examsAvgChartView",
    "views/exams/examsSubjectChartView",
    "views/exams/examsSubjectYearChartView",
    "views/exams/examsAvgYearView"

], function ($, defaultView, tpl, Model, _, utils, avgChartView, subjectChartView, subjectYearChartView, avgYearView) {
    "use strict";
    /**
     * @name module:examsView
     * @description Exams widget class
     * @class Backbone.View
     *
     * @requires module:defaultView
     * @requires module:examsModel
     * @requires text!templates/examsTpl {String} Exams hbs template
     * @requires underscore
     * @requires module:utils
     * @requires module:examsAvgChartView
     * @requires module:examsSubjectChartView
     * @requires module:examsSubjectYearChartView
     * @requires module:examsAvgYearView
     *
     * @see module:defaultView
     * @see module:utils
     * @see module:examsModel
     * @see module:examsAvgChartView
     * @see module:examsSubjectChartView
     * @see module:examsSubjectYearChartView
     * @see module:examsAvgYearView
     *
     * @constructor
     * @returns {Function} Backbone.View constructor
     */

    var MENU_PRIMARY_CLASS = ".enw__menu--primary",
        MENU_SECONDARY_CLASS = ".enw__menu--secondary";

    return defaultView.extend({
        /**
         * @name module:examsView#template
         * @description Raw handlebars template
         * @type {String}
         */
        template: tpl,

        /**
         * @name module:examsView#name
         * @description Exams template id (need for caching)
         * @type {String}
         */
        name: "examsTpl",

        /**
         * @name module:examsView#title
         * @description Default exams widget title
         * @type {String}
         */
        title: "egeTitle",

        /**
         * @name module:examsView#ModelConstructor
         * @see module:defaultView#ModelConstructor
         * @see module:examsModel
         * @description Exams (EGE) model class
         */
        ModelConstructor: Model,

        /**
         * @name module:examsView#mode
         * @description Current widget mode
         * @type {Object}
         * @example
         * {
         *   subject: "avg",
         *   year: "yearSlice"
         * }
         */
        mode: {
            subject: "avg",
            year: "yearSlice"
        },

        /**
         * @name module:examsView#renderData
         * @description Exams charts update & widget menu render
         * @function
         */
        renderData: function () {
            var collection = this.model.get("collection"),
                relatedView = this.getRelatedView();

            /* istanbul ignore else */
            if (this.renderMenu) {
                // Getting unique subjects and years from model
                this.renderMenu(
                    ["avg"].concat(_.uniq(_.pluck(collection, 'name'))),
                    MENU_PRIMARY_CLASS
                );
                this.renderMenu(
                    ["yearSlice"].concat(_.uniq(_.map(collection, function (value) {
                        return (new Date(value.date)).getFullYear().toString();
                    }))),
                    MENU_SECONDARY_CLASS
                );

                // There's no need to render another one;
                this.renderMenu = undefined;
            }

            //this.switchModeDelayed();
            this.showMsg();

            // Foolproof
            /* istanbul ignore else */
            if (relatedView) {

                relatedView.render(
                    collection || this.model.attributes,
                    this.model.get("subtype") || this.model.get("name")
                );
                this.switchRelatedView(relatedView.$el);
            }
            return this.model.attributes;
        },
        /**
         * @name module:examsView#afterRender
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
         * @name module:examsView#getRelatedView
         * @description Gets related view by widget mode
         * @function
         */
        getRelatedView: function () {
            var mode = this.mode,
                SELECTOR,
                hash,
            // Related view constructor
                View;

            // true alias
            switch (!!mode) {
            case mode.subject === "avg" && mode.year === "yearSlice":
                hash = "avgChart";
                SELECTOR = ".avgChart";
                View = avgChartView;
                break;
            case mode.year === "yearSlice":
                hash = "subjectChart";
                SELECTOR = ".subjectChart";
                View = subjectChartView;
                break;
            case (typeof mode.year === "number") && mode.subject !== "avg":
                hash = "subjectYearChart";
                SELECTOR = ".subjectYearChart";
                View = subjectYearChartView;
                break;
            default:
                //case typeof mode.year === "number" && mode.subject === "avg":
                hash = "avgYearTable";
                SELECTOR = ".avgYearTable";
                View = avgYearView;
            }
            // Delayed chart initialization
            return this.initRelatedView(hash, View, SELECTOR);

        },
        /**
         * @name module:examsView#onMenuClick
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

                // Looks weird
                if ($target.parent().is(MENU_PRIMARY_CLASS)) {
                    this.switchMode(mode);
                } else {
                    this.switchMode(undefined, mode);
                }
            }
            return mode;
        },
        /**
         * @name module:examsView#switchMode
         * @description Updates model state by selected mode
         * @function
         * @param [subject] {String|Object} Subject or {subject:"subject", year: 2000}
         * @param [year] {String|Number} Year in xxxx format
         */
        switchMode: function (subject, year) {
            var mode = this.setMode(subject, year),
                model = this.model,
                url = model.host + "/" + model.path;

            /* istanbul ignore else */
            if (mode) {

                // Menu class switch
                this.selectMenuItem(mode.subject, this.$el.find(MENU_PRIMARY_CLASS));
                this.selectMenuItem(mode.year, this.$el.find(MENU_SECONDARY_CLASS));

                // NB: As far as we have no pre-initialized related views
                // DOM state may be switched in renderData callback only
                // So we just form the request and wait. DDP as is.

                // "avg" mode has empty subtype
                /* istanbul ignore else */
                if (mode.subject !== "avg") {
                    url += "/" + mode.subject;
                }
                /* istanbul ignore else */
                if (mode.year && mode.year !== "yearSlice") {
                    url += "/" + mode.year;
                }

                this.fetch(url);
            }
            return mode;
        }
    });
});