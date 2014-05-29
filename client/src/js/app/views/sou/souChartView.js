/*global require, define, console, $ */
/*jslint nomen: true, debug: true */

/**
 * @module souChartView
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
         * @name module:souChartView
         * @description Sou dynamics chart
         * @requires module:chartView
         * @class Backbone.View
         * @requires module:chartView
         * @requires underscore
         * @requires module:utils
         * @see module:utils
         * @see module:module:chartView
         * @constructor
         * @returns {Function} Backbone.View constructor
         */
        return chartView.extend({
            /**
             * @name module:souChartView#update
             * @description Updates chart state by new data
             * @function
             * @param [data] {array} New data
             * @param [type] {string} Subject
             * @returns {object|undefined} chart.series or undefined
             */
            update: function (data, type) {
                if (this.chart && data) {
                    var range,
                        min = Infinity,
                        i,
                        avg = [],
                        subject = [],
                        data0,
                        data1,
                        series = this.chart.series,
                        s0 = series[0],
                        s1 = series[1];

                    _.each(data, function (item) {
                        i = item.indicator.quality;
                        if (item.year < min) {
                            min = item.year;
                        }
                        if (i.raw) {
                            subject[item.year] = i.raw[0].average;
                        }
                        avg[item.year] = i.average;

                    });
                    avg = utils.replace(avg.slice(min, avg.length), undefined, null);



                    range = _.range(min, min + avg.length);

                    this.chart.xAxis[0].setCategories(range);
                    data0 = {
                        data: avg,
                        name: "sou".toLocaleString()
                    };

                    if (s0) {
                        s0.update(data0, false);
                    } else {
                        this.chart.addSeries(data0, false);
                    }
                    if (subject.length) {
                        subject = utils.replace(subject.slice(min, subject.length), undefined, null);
                        data1 = {
                            data: subject,
                            name: "sou".toLocaleString() + "-" + type.toLocaleString().toLocaleLowerCase()
                        };
                        if (s1) {
                            s1.update(data1, false);
                        } else {
                            this.chart.addSeries(data1, false);
                        }
                    } else if (s1) {
                        s1.options.showInLegend = false;
                        s1.legendItem = null;
                        this.chart.legend.destroyItem(s1);
                        s1.remove(false);
                    }
                    this.chart.legend.render();
                    this.redraw();
                    return series;
                }
                return;
            }
        });
    });