/*global require, define, console, $, setTimeout */
/*jslint nomen: true, debug: true */

/**
 * @module examsSubjectYearChartView
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
         * @name module:examsSubjectYearChartView
         * @description Exam subject-year chart view
         * @class Backbone.View
         * @requires module:chartView
         * @requires framework
         * @requires underscore
         * @requires module:utils
         * @constructor
         * @returns {Function} Backbone.View constructor
         */

        return chartView.extend({
            /**
             * @name module:examsSubjectYearChartView#type
             * @description Chart type identifier
             * @type {string}
             */
            type: "pie",
            /**
             * @name module:examsSubjectYearChartView#options
             * @description Chart options extension
             * @property
             * @type {object}
             */
            options: {
                series: [
                    {
                        size: '60%',
                        dataLabels: {
                            formatter: function () {
                                return this.y > 5 ? this.point.name : null;
                            },
                            color: 'white',
                            distance: -30
                        }
                    },
                    {
                        size: '80%',
                        innerSize: '60%',
                        dataLabels: {
                            formatter: function () {
                                // display only if larger than 0
                                //return '<b>' + this.point.name + '</b><br/>' + this.y.toPrecision(3) + '%';
                                return this.y > 0 ? '<b>' + this.point.name + '</b><br/>' + this.y.toPrecision(3) + '%' : null;
                            }
                        }
                    }
                ]
            },
            /**
             * @name module:examsSubjectYearChartView#update
             * @description Updates chart state by new data
             * @function
             * @returns {object|undefined} series or undefined
             */
            update: function (data) {
                if (this.chart && data) {
                    data.total = data.total / 100;
                    var view = this,
                        belowThreshold = data.belowThreshold / data.total,
                        passed = 100 - belowThreshold,
                        excellent = (data.excellent - data.bullseye) / data.total,
                        bullseye = data.bullseye / data.total,
                        belowExcellent = passed - bullseye - excellent,
                        colors = Highcharts.getOptions().colors,
                        categories = ["passed".toLocaleString(), "failed".toLocaleString()],
                        // Data arrays
                        groupData = [],
                        subgroupData = [],
                        i,
                        j,
                        brightness;


                    data = [
                        {
                            y: passed,
                            color: colors[0],
                            drilldown: {
                                name: "failed".toLocaleString(),
                                categories: [
                                    data.threshold + ' ... ' + data.excellentThreshold,
                                    "excellent".toLocaleString() + " (>" + data.excellentThreshold + ")",
                                    "maximum".toLocaleString() + " (" + data.limit + ")"
                                ],
                                data: [belowExcellent, excellent, bullseye],
                                color: colors[0]
                            }
                        },
                        {
                            y: belowThreshold,
                            color: colors[1],
                            drilldown: {
                                name: "passed".toLocaleString(),
                                categories: ['0 ... ' + data.threshold],
                                data: [belowThreshold],
                                color: colors[1]
                            }
                        }
                    ];

                    for (i = 0; i < data.length; i += 1) {
                        groupData.push({
                            name: categories[i],
                            y: data[i].y,
                            color: data[i].color
                        });
                        // Color vanishing
                        for (j = 0; j < data[i].drilldown.data.length; j += 1) {
                            brightness = 0.2 - (j / data[i].drilldown.data.length) / 5;
                            subgroupData.push({
                                name: data[i].drilldown.categories[j],
                                y: data[i].drilldown.data[j],
                                color: Highcharts.Color(data[i].color).brighten(brightness).get()
                            });
                        }
                    }
                    this.updatePie(groupData, subgroupData);
                    this.redraw();
                    return this.chart.series;
                }
                return;
            }
        });
    });