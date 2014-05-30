/*globals define, test, equal, ok, $, describe, it, beforeEach, afterEach, expect, window*/
/*jslint nomen: true, debug: true, bitwise: true, todo: true */

define(function (require) {
    'use strict';
    require('highcharts');

    var jh = require('tests/_helpers/jasmineHelper'),
        _ = require('underscore'),
        View = require('views/population/populationYearChartView'),
        config = $.extend(true, {}, {
            widget: {
                switchMode: jh.fn.fnFirstArg
            }
        }, jh.defConfig),
        view = new (View.extend(config))();

    describe("populationYearChartView", function () {
        beforeEach(function () {
            jh.prepareDOM();
        });
        afterEach(function () {
            jh.clearDOM();
        });

        it("examsAvgChartView constructor existence", function () {
            expect(!!View).toBe(true);
        });
        it("view existence", function () {
            expect(!!view).toBe(true);
        });
        it("Chart creation", function () {
            // Expected arguments: node, type, options
            expect(!!view.create()).toBe(true);
        });

        it("Data update", function () {
            expect(view.update()).toBe(undefined);
            var data = {
                    "overall": 762,
                    "total": [78, 76, 75, 75, 74, 72, 73, 73, 74, 44, 48],
                    "female": [38, 42, 38, 39, 42, 37, 41, 37, 40, 26, 28],
                    "male": [40, 34, 37, 36, 32, 35, 32, 36, 34, 18, 20]
                },
                series;

            // Update & apply
            view.update(data);
            view.chart.redraw(true);

            //series = view.chart.series[1];

            // Calculations
            expect(view.chart.series[0].data[1].y).toBe(34);
            expect(view.chart.series[1].data[3].y).toBe(39);
        });

        it("Test formatters", function () {
            var data = {
                    "overall": 762,
                    "total": [78, 76, 75, 75, 74, 72, 73, 73, 74, 44, 48],
                    "female": [38, 42, 38, 39, 42, 37, 41, 37, 40, 26, 28],
                    "male": [40, 34, 37, 36, 32, 35, 32, 36, 34, 18, 20]
                },
                series,
                point;

            view.update(data);
            view.chart.redraw(true);

            series = view.chart.series[1];
            point = series.data[0];

            expect(typeof view.options.tooltip.formatter.apply(point)).toBe("string");
        });
    });
});