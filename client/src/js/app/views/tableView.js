/*global require, define, console, Sortable */
/*jslint nomen: true, debug: true */

/**
 * @module tableView
 */

define([
    "backbone",
    "framework",
    "handlebars",

    "sortable"
],
    function (Backbone, $, Handlebars) {
        "use strict";
        /**
         * @name module:tableView
         * @description Table view
         * @class Backbone.View
         * @requires Backbone
         * @requires framework
         * @constructor
         * @returns {Function} Backbone.View constructor
         */


        return Backbone.View.extend({
            /**
             * @name module:tableView#create
             * @description Creates a new one table
             * @function
             * @returns {$|undefined} $-instance or undefined
             */
            create: function () {
                /* istanbul ignore else */
                if (!this.table && this.template) {
                    this.table = this.$el.append(Handlebars.compile(this.template)()).find("table");

                    // Row template morph: compiled after table.create
                    /* istanbul ignore else */
                    if (typeof this.rowTemplate === "string") {
                        this.rowTemplate = Handlebars.compile(this.rowTemplate);
                    }
                    this.afterRender();
                }
                return this.table;
            },
            /**
             * @name module:tableView#update
             * @description Updates table by new data
             * @function
             * @returns {boolean} true
             */
            update: function () {
                return true;
            },
            /**
             * @name module:tableView#render
             * @description Renders template and appends to DOM.
             * .render() also triggers this.update()
             * @function
             * @returns view {object} current view instance
             */
            render: function (data) {
                this.create();
                this.update.apply(this, arguments);
                return this;
            },
            /**
             * @name module:tableView#afterRender
             * @description After render
             * @function
             */
            afterRender: function () {
            },
            /**
             * @name module:tableView#initSortable
             * @description Adds sorting for the table
             * @function
             */
            initSortable: function () {
                if (Sortable && this.table) {
                    Sortable.initTable(this.table.get(0));
                    return true;
                }
                return false;
            }
        });
    });