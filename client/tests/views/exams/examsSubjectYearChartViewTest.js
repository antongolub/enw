/*globals define, test, equal, ok, $, describe, it, beforeEach, afterEach, expect, window*/
/*jslint nomen: true, debug: true, bitwise: true, todo: true */

define(function (require) {
    'use strict';
    require('highcharts');

    var jh = require('tests/_helpers/jasmineHelper'),
        View = require('views/exams/examsSubjectYearChartView'),
        config,
        view;

    jh.prepareDOM();
    config = $.extend(true, {}, {
        widget: {
            switchMode: jh.fn.fnFirstArg
        }
    });
    view = new (View.extend(config))();
    jh.prepareDOM();
    describe("examsSubjectYearChartView", function () {
        it("examsSubjectYearChartViewTest constructor existence", function () {
            expect(!!View).toBe(true);
        });
        it("view existence", function () {
            expect(!!view).toBe(true);
        });
        it("update", function () {
            expect(view.update()).toBe(undefined);
            var data = {
                __v: 0,
                _id: "52dec66a370545042e0002d5",
                average: 67.86,
                averageCity: 67.97,
                averageCountry: 68.05,
                averageRegion: 67.84,
                belowThreshold: 2,
                bullseye: 1,
                excellent: 13,
                excellentThreshold: 65,
                gtotal: 50,
                limit: 100,
                maximum: 100,
                minimum: 22,
                name: "math",
                path: "exams/ege/math/2012",
                threshold: 24,
                total: 50,
                type: "ege",
                unique: 11,
                hits: 25,
                date: 1339012800000
            };
            view.status = 2;
            view.create();

            // Passed, %
            expect(view.update(data)[0].data[0].y).toBe(96);
        });
    });
    jh.clearDOM();
});