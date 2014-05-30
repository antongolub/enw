/*globals define, test, equal, ok, $, describe, it, beforeEach, afterEach, expect, window*/
/*jslint nomen: true, debug: true, bitwise: true, todo: true */

define(function (require) {
    'use strict';
    require('highcharts');

    var jh = require('tests/_helpers/jasmineHelper'),
        _ = require('underscore'),
        View = require('views/sou/souChartView'),
        config = $.extend(true, {}, {
            widget: {
                switchMode: jh.fn.fnFirstArg
            }
        }, jh.defConfig),
        view = new (View.extend(config))();

    describe("souChartView", function () {
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
                      "indicator": {
                        "quality": {
                          "average": 60
                        }
                      }
                    },
                    {
                      "_id": "52dc10c25e4a3ce50b0004bc",
                      "year": 2012,
                      "indicator": {
                        "quality": {
                          "average": 65
                        }
                      }
                    }
                  ],
                series;

            // Update & apply
            view.update(data);
            view.chart.redraw(true);

            series = view.chart.series[1];

            // Check calculations
            expect(view.chart.series[0].data[0].y).toBe(60);
            expect(view.chart.series[0].data[1].y).toBe(65);
            expect(view.chart.series[0].data[0].category).toBe(2011);
            
            data = [{
                "_id": "test____yy____",
                "year": 2011,
                "indicator": {
                    "quality": {
                        "average": 20,
                        "raw": [
                            {
                                "name": "math",
                                "average": 20
                            }
                        ]
                    }
                }
            }];
            
            view.update(data, "test");
            view.chart.redraw(true);
            expect(view.chart.series[0].data[0].y).toBe(20);
            
            // 2nd legend item should be switched off
            data = [{
              "_id": "52db8c576f60c9315a0000e1",
              "year": 2011,
              "indicator": {
                "quality": {
                  "average": 60
                }
              }
            }];
            view.update(data, "test");
            view.chart.redraw(true);
            expect(view.chart.series[0].data[0].y).toBe(60)
        });
    });
});