/*globals define, test, equal, ok, $, describe, it, beforeEach, afterEach, expect, window*/
/*jslint nomen: true, debug: true, bitwise: true, todo: true */

define(function (require) {
    'use strict';
    require('highcharts');

    var jh = require('tests/_helpers/jasmineHelper'),
        View = require('views/exams/examsSubjectChartView'),
        config,
        view;

    jh.prepareDOM();
    config = $.extend(true, {}, {
        widget: {
            switchMode: jh.fn.fnFirstArg
        }
    }, jh.defConfig);
    view = new (View.extend(config))();

    describe("examsSubjectChartView", function () {

        it("examsSubjectChartView constructor existence", function () {
            expect(!!View).toBe(true);
        });
        it("view existence", function () {
            expect(!!view).toBe(true);
        });
        it("view render", function () {
            expect(view.render()).toBe(view);
        });
        it("view update", function () {
            var data = {
                ts: 1390417623744,
                collection: [
                    {
                        _id: "52dec5ec370545042e0002d4",
                        average: 67.87,
                        averageCity: 67.96,
                        averageCountry: 67.99,
                        averageRegion: 67.32,
                        gtotal: 46,
                        name: "math",
                        total: 46,
                        date: 1307304000000
                    },
                    {
                        _id: "52dec66a370545042e0002d5",
                        average: 67.86,
                        averageCity: 67.97,
                        averageCountry: 68.05,
                        averageRegion: 67.84,
                        gtotal: 0,
                        name: "math",
                        total: 0,
                        date: 1339012800000
                    }
                ],
                name: "math",
                type: "ege"
            };
            expect(view.update(data.collection).school[0]).toBe(67.87);
        });
        it("Test formatters", function () {
            view.chart.redraw(true);

            var series = view.chart.series[1],
                point = series.data[0];

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
    jh.clearDOM();
});