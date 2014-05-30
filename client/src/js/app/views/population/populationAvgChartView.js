/*global require, define, console, $ */
/*jslint nomen: true, debug: true, todo: true */

/**
 * @module populationAvgChartView
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
         * @name module:populationAvgChartView
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
             * @name module:populationAvgChartView#type
             * @description Chart type
             * @type {string}
             */
            type: "spline",
            /**
             * @name module:populationAvgChartView#options
             * @description Chart config extension object
             * @type {object}
             */
            options: {
                yAxis: {
                    title: {
                        text: "population".toLocaleString()
                    },
                    min: 0
                },
                plotOptions: {
                    series: {
                        point: {
                            events: {
                                click: function () {
                                    this.series.chart.options
                                        .getWidget().switchMode({
                                            year: this.category
                                        });
                                    return this.category;
                                }
                            }
                        }
                    }
                },
                series: [
                    {
                        name: "male".toLocaleString()
                    },
                    {
                        name: "female".toLocaleString()
                    },
                    {
                        name: "total".toLocaleString()
                    }
                ],
                tooltip: {
                    formatter: function () {
                        return "<b>" + this.series.name + "</b><br/>" + this.x + ": " + this.y.toPrecision(3);
                    }
                }
            },
            /**
             * @name module:populationAvgChartView#update
             * @description Updates chart state by new data
             * @function
             * @param [data] {array} new data
             * @returns {object|undefined} chart.series or undefined
             */
            update: function (data) {
                if (this.chart && data) {
                    var range,
                        j,
                        min = Infinity,
                        max = -Infinity,
                        series = {
                            male: [],
                            female: [],
                            total: []
                        };

                    _.each(data, function (i) {
                        /* istanbul ignore else */
                        if (i.year > max) {
                            max = i.year;
                        }
                        if (i.year < min) {
                            min = i.year;
                        }
                    });
                    _.each(data, function (i) {
                        j = i.year - min;
                        i = i.population;

                        series.male[j] = utils.sum(i.male);
                        series.female[j] = utils.sum(i.female);
                        series.total[j] = i.overall;

                    });

                    range = _.range(min, max + 1);

                    _.each(series, function (s) {
                        s = utils.replace(undefined, null);
                    });
                    this.updateSpline(series.male, series.female, series.total);
                    this.chart.xAxis[0].setCategories(range, false);

                    this.redraw();
                    return series;
                }
                return;
            }
        });
    });