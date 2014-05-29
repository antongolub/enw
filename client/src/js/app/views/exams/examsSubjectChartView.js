/*globals define, test, equal, ok, $, describe, it, beforeEach, afterEach, expect, window*/
/*jslint nomen: true, debug: true */

/**
 * @module examsSubjectChartView
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
         * @name module:examsSubjectChartView
         * @description Exam subject chart view
         * @class Backbone.View
         * @requires module:chartView
         * @requires framework
         * @requires underscore
         * @requires module:utils
         * @constructor
         * @returns {Function} Backbone.View constructor
         */

        var AXISCOLOR = "#777",
            GRIDLINECOLOR = "#EEE";

        return chartView.extend({
            /**
             * @name module:examsSubjectChartView#type
             * @description Chart type identifier
             * @type {string}
             */
            type: "spline",
            /**
             * @name module:examsSubjectChartView#options
             * @description Chart options extension
             * @property
             * @type {object}
             */
            options: {
                yAxis: [
                    {
                        title: {
                            text: "score".toLocaleString() + ", %",
                            style: {
                                color: AXISCOLOR,
                                fontWeight: "normal"
                            }
                        },
                        gridLineColor: GRIDLINECOLOR
                    },
                    {
                        title: {
                            text: "choice".toLocaleString() + ", %",
                            style: {
                                color: AXISCOLOR,
                                fontWeight: "normal"
                            }
                        },
                        gridLineColor: GRIDLINECOLOR,
                        opposite: true
                    }
                ],
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
                        name: "school".toLocaleString()
                    },
                    {
                        name: "district".toLocaleString()
                    },
                    {
                        name: "region".toLocaleString()
                    },
                    {
                        name: "country".toLocaleString()
                    },
                    {
                        name: "whoChose".toLocaleString(),
                        dashStyle: "shortdot",
                        yAxis: 1
                    }
                ]
            },
            /**
             * @name module:examsSubjectChartView#update
             * @description Updates chart state by new data
             * @function
             * @returns {object|undefined} series or undefined
             */
            update: function (data, type) {
                if (this.chart && data) {
                    var range,
                        view = this,
                        i,
                        min = Infinity,
                        max = -Infinity,
                        series = {
                            school:     [],
                            city:       [],
                            region:     [],
                            country:    [],
                            choice:     []
                        };
                    _.each(data, function (exam) {
                        var year = (new Date(exam.date)).getFullYear();
                        /* istanbul ignore else */
                        if (year > max) {
                            max = year;
                        }
                        if (year < min) {
                            min = year;
                        }
                        exam.y = year;
                    });

                    _.each(data, function (exam) {
                        i = exam.y - min;
                        series.school[i] =  exam.average;
                        series.city[i] =    exam.averageCity;
                        series.region[i] =  exam.averageRegion;
                        series.country[i] = exam.averageCountry;
                        series.choice[i] =  100 * exam.total / (exam.gtotal || exam.total || 1);
                    });

                    range = _.range(min, max + 1);

                    _.each(series, function (s) {
                        s = utils.replace(undefined, null);
                    });



                    this.updateSpline(series.school, series.city, series.region, series.country, series.choice);
                    this.chart.xAxis[0].setCategories(range, false);

                    this.redraw();
                    return series;
                }
                return undefined;
            }
        });
    });