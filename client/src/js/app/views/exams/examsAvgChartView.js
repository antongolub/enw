/*global require, define, console, $ */
/*jslint nomen: true, debug: true, todo: true */

/**
 * @module examsAvgChartView
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
         * @name module:examsAvgChartView
         * @description Average exams chart
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
             * @name module:examsAvgChartView#examType
             * @description Exam type declaration
             * @type {string}
             */
            examType: "ege",
            /**
             * @name module:examsAvgChartView#type
             * @description Chart type
             * @type {string}
             */
            type: "spline",
            /**
             * @name module:examsAvgChartView#options
             * @description Chart config extension object
             * @type {object}
             */
            options: {
                yAxis: {
                    title: {
                        text: "score".toLocaleString() + ", %"
                    }
                },
                tooltip: {
                    formatter: function () {
                        return "<b>" + this.series.name + "</b><br/>" + this.x + ": " + this.y.toPrecision(3);
                    }
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
                        name: "weightedAvg".toLocaleString()
                    },
                    {
                        name: "weightedAvgMathRus".toLocaleString()
                    }
                ]
            },
            /**
             * @name module:examsAvgChartView#dataproc
             * @description Data processing helpers
             * @type {object}
             */
            dataproc: {
                /**
                 * @name module:examsAvgChartView#dataproc@respDivider
                 * @description Series data formatter.
                 * Divides 1st array elements by 2nd's elements with same index
                 * @param dividends {array} Dividends array
                 * @param divisors {array} Divisors array
                 * @param range {array} Intersection indexes
                 * @param [shift] {number}
                 * @function
                 */
                respDivider: function (dividends, divisors, range, shift) {
                    shift = shift || 0;
                    var i;
                    return _.map(range, function (v, k) {
                        // undefined is not a null for Highcharts.js
                        i = dividends[v - shift];
                        return typeof i === 'number' && !isNaN(i) ?
                                i / (divisors[v - shift] || 1) :
                                null;
                    });
                }
            },
            /**
             * @name module:examsAvgChartView#update
             * @description Updates chart state by new data
             * @function
             * @param [data] {array} new data
             * @returns {object|undefined} chart.series or undefined
             */
            update: function (data) {
                // If we got the same data as rendered skip below
                // TODO: _.isEqual costs a lot for big collections. Think about it
                if (this.chart && data && !_.isEqual(this.data, data)) {

                    this.data = data;

                    var view = this,
                        min = Infinity,
                        max = -Infinity,
                        range,
                        year,
                        exam = {},
                        weight = {},
                        series = this.chart.series,

                    // Average math & rus exam result is shown separately
                        weightMathRus = {},
                        examMathRus = {};

                    // There's no way to predict exams date range.
                    // May be this value should be defined on server-side

                    _.each(data, function (item) {
                        // Previous API support
                        year = item.year || (new Date(item.date)).getFullYear();
                        item.year = year;
                        /* istanbul skip else */
                        if (year > max) {
                            max = year;
                        }
                        /* istanbul skip else */
                        if (year < min) {
                            min = year;
                        }
                    });

                    // Weighted data extraction
                    _.each(data, function (item) {
                        year = item.year - min;
                        // exam[year] is undefined by default
                        exam[year] = 100 * item.average / item.limit * item.total + (exam[year] || 0);
                        weight[year] = item.total + (weight[year] || 0);

                        /* istanbul skip else */
                        if (item.name === "math" || item.name === "russian") {
                            examMathRus[year] = 100 * item.average / item.limit * item.total + (examMathRus[year] || 0);
                            weightMathRus[year] = item.total + (weightMathRus[year] || 0);
                        }
                    });

                    // x axis range
                    range = _.range(min, max + 1);
                    // false second argument is needed to prevent useless redraw
                    series[0].update(
                        {data: this.dataproc.respDivider(exam, weight, range, min)},
                        false
                    );
                    series[1].update(
                        {data: this.dataproc.respDivider(examMathRus, weightMathRus, range, min)},
                        false
                    );
                    this.chart.xAxis[0].setCategories(range, false);

                    this.redraw();
                    return series;
                }
                return;
            }
        });
    });