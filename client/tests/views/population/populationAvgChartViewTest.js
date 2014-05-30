/*globals define, test, equal, ok, $, describe, it, beforeEach, afterEach, expect, window*/
/*jslint nomen: true, debug: true, bitwise: true, todo: true */

define(function (require) {
    'use strict';
    require('highcharts');

    var jh = require('tests/_helpers/jasmineHelper'),
        _ = require('underscore'),
        View = require('views/population/populationAvgChartView'),
        config = $.extend(true, {}, {
            widget: {
                switchMode: jh.fn.fnFirstArg
            }
        }, jh.defConfig),
        view = new (View.extend(config))();

    describe("populationAvgChartView", function () {
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
            var data = [
                    {
                        "_id": "52db8c576f60c9315a0000e1",
                        "year": 2011,
                        "population": {
                            "overall": 760,
                            "female": [42, 38, 39, 42, 37, 41, 37, 40, 38, 28, 26],
                            "male": [34, 37, 36, 32, 35, 32, 36, 34, 36, 20, 20]
                        }
                    },
                    {
                        "_id": "52dc10c25e4a3ce50b0004bc",
                        "year": 2012,
                        "population": {
                            "overall": 762,
                            "female": [38, 42, 38, 39, 42, 37, 41, 37, 40, 26, 28],
                            "male": [40, 34, 37, 36, 32, 35, 32, 36, 34, 18, 20]
                        }
                    }
                ],
                series;

            // Update & apply
            view.update(data);
            view.chart.redraw(true);

            //series = view.chart.series[1];

            // Calculations
            expect(view.chart.series[0].data[0].y).toBe(352);
            expect(view.chart.series[1].data[0].y).toBe(408);
            expect(view.chart.series[2].data[0].y).toBe(760);
            expect(view.chart.series[0].data[0].category).toBe(2011);

        });

        it("Test formatters", function () {
            var data = [
                    {
                        "_id": "52db8c576f60c9315a0000e1",
                        "year": 2011,
                        "population": {
                            "overall": 760,
                            "female": [42, 38, 39, 42, 37, 41, 37, 40, 38, 28, 26],
                            "male": [34, 37, 36, 32, 35, 32, 36, 34, 36, 20, 20]
                        }
                    }
                ],
                series,
                point;

            view.update(data);
            view.chart.redraw(true);

            series = view.chart.series[1];
            point = series.data[0];

            expect(typeof view.options.tooltip.formatter.apply(point)).toBe("string");
            expect(
                view
                    .options
                    .plotOptions
                    .series
                    .point
                    .events
                    .click
                    .apply(point)
            ).toBe(2011);
        });
    });
});