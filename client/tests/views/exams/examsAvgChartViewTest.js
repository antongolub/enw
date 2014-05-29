/*globals define, test, equal, ok, $, describe, it, beforeEach, afterEach, expect, window*/
/*jslint nomen: true, debug: true, bitwise: true, todo: true */

define(function (require) {
    'use strict';
    require('highcharts');

    var jh = require('tests/_helpers/jasmineHelper'),
        _ = require('underscore'),
        View = require('views/exams/examsAvgChartView'),
        config = $.extend(true, {}, {
            widget: {
                switchMode: jh.fn.fnFirstArg
            }
        }, jh.defConfig),
        view = new (View.extend(config))();

    describe("examsAvgChartView", function () {
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
        // Helpers test
        it("dataproc.respDivider", function () {
            expect(_.isEqual(
                view.dataproc.respDivider(
                    [2, 4, 10, 0, 1, undefined, null],
                    [1, 4, 5, 1, 0, 2, 3],
                    [0, 1, 2, 3, 4, 5, 6]
                ),
                [2, 1, 2, 0, 1, null, null]
            )).toBe(true);
        });
        it("Data update", function () {
            expect(view.update()).toBe(undefined);
            var data = [
                    {
                        "_id": "52dd5bcf7f608a961d00000b",
                        "average": 20,
                        "limit": 100,
                        "name": "math",
                        "total": 10,
                        "type": "ege",
                        "date": 1306958400000
                    },
                    {
                        "_id": "52dd5bcf7f608a961d00000b",
                        "average": 40,
                        "limit": 100,
                        "name": "english",
                        "total": 40,
                        "type": "ege",
                        "date": 1306958500000
                    },
                    {
                        "_id": "52dd5e137f608a961d00000c",
                        "average": 30,
                        "limit": 100,
                        "name": "russian",
                        "total": 50,
                        "type": "ege",
                        "date": 1338235200000
                    }
                ],
                series;

            // Update & apply
            view.update(data);
            view.chart.redraw(true);

            series = view.chart.series[1];

            // Check calculations
            expect(view.chart.series[0].data[0].y).toBe(36);
            expect(view.chart.series[1].data[0].y).toBe(20);
            expect(view.chart.series[1].data[1].y).toBe(30);
            expect(view.chart.series[0].data[0].category).toBe(2011);

        });

        it("Test formatters", function () {
            var data = [
                    {
                        "_id": "52dd5bcf7f608a961d00000b",
                        "average": 20,
                        "limit": 100,
                        "name": "math",
                        "total": 10,
                        "type": "ege",
                        "date": 1306958400000
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