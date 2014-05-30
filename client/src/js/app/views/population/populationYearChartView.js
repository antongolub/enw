/*global require, define, console, $ */
/*jslint nomen: true, debug: true, todo: true */

/**
 * @module populationYearChartView
 * @extends module:chartView
 */


define([
    "views/chartView",
    "underscore",
    "utils"
],
    function (chartView, _, utils) {
        "use strict";

        /**
         * @name module:populationYearChartView
         * @description Average population chart
         * @requires module:chartView
         * @class Backbone.View
         * @requires module:chartView
         * @requires underscore
         * @requires module:utils
         * @see module:utils
         * @constructor
         * @returns {Function} Backbone.View constructor
         */
        return chartView.extend({
            /**
             * @name module:populationYearChartView#type
             * @description Chart type
             * @type {string}
             */
            type: "column",
            /**
             * @name module:populationYearChartView#options
             * @description Chart config extension object
             * @type {object}
             */
            options: {
                yAxis: {
                    title: {
                        text: "population".toLocaleString()
                    }
                },
                series: [
                    {
                        name: "male".toLocaleString()
                    },
                    {
                        name: "female".toLocaleString()
                    }
                ],
                tooltip: {
                    formatter: function () {
                        return "<b>" + this.series.name + "</b><br/>" + this.x + ": " + this.y.toFixed(0);
                    }
                }
            },
            /**
             * @name module:populationYearChartView#update
             * @description Updates chart state by new data
             * @function
             * @param [data] {array} new data
             * @returns {object|undefined} chart.series or undefined
             */
            update: function (data) {
                //return
                if (this.chart && data) {
                    var view = this,
                        range = _.range(1, 12),
                        series = {
                            male: [].concat(data.male),
                            female: [].concat(data.female)
                        };

                    _.each(data, function (s) {
                        s = utils.replace(undefined, null);
                    });

                    this.updateCol(series.male, series.female);
                    this.chart.xAxis[0].setCategories(range, false);

                    this.redraw();
                    return data;
                }
                return;
            }
        });
    });