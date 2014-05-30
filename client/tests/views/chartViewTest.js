/*globals define, test, equal, ok, $, describe, it, beforeEach, afterEach, expect, window*/
/*jslint nomen: true, debug: true, bitwise: true, todo: true */

define(function (require) {
    'use strict';

    require('highcharts');

    var jh = require('tests/_helpers/jasmineHelper'),
        Backbone = require('backbone'),
        View = require('views/chartView'),
        config = $.extend(true, {}, {
            widget: "parentWidget"
        }, jh.defConfig),
        view = new (View.extend(config))();

    describe("chartView tests", function () {

        beforeEach(function () {
            jh.prepareDOM();
        });
        afterEach(function () {
            jh.clearDOM();
        });
        it("chartView constructor existence check", function () {
            expect(!!View).toBe(true);
        });
        it("view existence", function () {
            expect(!!view).toBe(true);
        });
        it("Parent widget availability", function () {
            expect(view.getWidget()).toBe("parentWidget");
        });

        it("Chart creation", function () {
            // Expected arguments: node, type, options
            expect(!!view.create()).toBe(true);

            // If chart exists already returns null
            expect(view.create()).toBe(null);
        });
        it("Chart destruction", function () {
            expect(view.flush()).toBe(null);
        });
        // Should return true by default
        it("Chart update", function () {
            expect(view.update()).toBe(true);
        });
        // Render creates this.chart if necessary and returns view instance
        it("Chart render", function () {
            expect(view.render()).toBe(view);
        });
        it("updateSeries", function () {
            // If series is undefined returns null
            expect(view.updateSeries()).toBe(null);

            // But now it should return series object
            view.chart.addSeries({}, false);
            expect(!!view.updateSeries([])).toBe(true);

            // y-value should mutate after update
            view.chart.addSeries({data: [1, 2, 3]}, false);
            expect(view.updateSeries([3, 2, 1], 1).data[0].y).toBe(3);
            expect(view.updateSeries([0, 4], 1).data[0].y).toBe(0);

            // updateCol, updatePie, updateSpline should return array of chart series
            expect(view.updateCol([3, 3], 1)[0].data[0].y).toBe(3);
            expect(view.updatePie([2, 4], 1)[0].data[1].y).toBe(4);
            expect(view.updateSpline([5, 5, 5])[0].hasOwnProperty("data")).toBe(true);

            // Mixed notation
            var series = view.updateSpline([5, 5, 5], {data: [1, 2, 3]})[0],
                point;

            // series data should change only AFTER redraw
            view.chart.redraw(true);
            expect(series.data[0].y).toBe(5);


            // Test formatters
            series.name = "name";
            point = series.data[0];
            point.series._i = 0;
            point.series.chart.options = {
                series: [series]
            };
            point.point = {
                name: "point"
            };
            // Formatter should return string
            expect(typeof view.chartOptions.column.tooltip.formatter.apply(point)).toBe("string");
            expect(typeof view.chartOptions.pie.tooltip.formatter.apply(point)).toBe("string");
            expect(typeof view.chartOptions.spline.tooltip.formatter.apply(point)).toBe("string");

        });

    });
});