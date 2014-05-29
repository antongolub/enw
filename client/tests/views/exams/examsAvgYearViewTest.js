/*globals define, test, equal, ok, $, describe, it, beforeEach, afterEach, expect, window, console*/
/*jslint nomen: true, debug: true, bitwise: true, todo: true */

define(function (require) {
    'use strict';
    require('highcharts');

    var jh = require('tests/_helpers/jasmineHelper'),
        View = require('views/exams/examsAvgYearView'),
        config,
        view;

    jh.prepareDOM();
    config = $.extend(true, {}, {
        widget: {
            switchMode: jh.fn.fnFirstArg
        }
    });
    view = new (View.extend(config))();

    describe("examsAvgYearView", function () {

        it("examsAvgYearView constructor existence", function () {
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
                        _id: "52dec66a370545042e0002d5",
                        average: 67.86,
                        averageCity: 67.97,
                        averageCountry: 68.05,
                        averageRegion: 67.84,
                        belowThreshold: 1,
                        excellent: 13,
                        gtotal: 46,
                        limit: 100,
                        maximum: 100,
                        minimum: 22,
                        name: "math",
                        threshold: 24,
                        total: 46,
                        type: "ege"
                    },
                    {
                        _id: "52dec7ed370545042e0002d8",
                        average: 68.92,
                        averageCity: 68.96,
                        averageCountry: 69.07,
                        averageRegion: 68.81,
                        excellent: 14,
                        limit: 100,
                        maximum: 100,
                        minimum: 32,
                        name: "russian",
                        threshold: 36,
                        total: 46,
                        type: "ege"
                    }
                ],
                name: "2012",
                type: "ege"
            };
            expect(view.update([], data.name)[0]).toBe(undefined);
            expect(view.update(data.collection, data.name)[0].total).toBe(46);
        });
        it("onSubjectLinkClick", function () {
            view.widget.status = 2;
            var e = {
                target: $("<a href='' data-subject='math' data-year='2012'>test</a>")
            };
            expect(view.onSubjectLinkClick(e)).toBe("math");
        });
    });
    jh.clearDOM();
});