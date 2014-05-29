/*globals define, test, equal, ok, $, describe, it, beforeEach, afterEach, expect, window, console*/
/*jslint nomen: true, debug: true, bitwise: true, todo: true */

define(function (require) {
    'use strict';
    require('highcharts');

    var jh = require('tests/_helpers/jasmineHelper'),
        View = require('views/tableView'),
        config,
        view;

    jh.prepareDOM();
    config = $.extend(true, {}, {
        el: $(jh.defConfig.container),
        widget: {
            switchMode: jh.fn.fnFirstArg
        }
    });
    view = new (View.extend(config))();

    describe("examsSubjectChartView", function () {

        it("tableView constructor existence", function () {
            expect(!!View).toBe(true);
        });
        it("view existence", function () {
            expect(!!view).toBe(true);
        });
        it("initSortable", function () {
            // Should return false if table is not rendered
            expect(view.initSortable()).toBe(false);
        });
        it("table render", function () {
            view.template = "<table data-sortable></table>";

            expect(view.render()).toBe(view);
        });
        it("update", function () {
            expect(typeof view.update).toBe("function");
        });
    });
});