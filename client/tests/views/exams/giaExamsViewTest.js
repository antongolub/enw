/*globals define, test, equal, ok, $, describe, it, beforeEach, afterEach, expect, window, console*/
/*jslint nomen: true, debug: true, bitwise: true, todo: true */

define(function (require) {
    'use strict';
    var jh = require('tests/_helpers/jasmineHelper'),
        Backbone = require('backbone'),
        View = require('views/exams/giaExamsView'),
        utils = require('utils'),
        status = 0,
        config,
        view;

    jh.prepareDOM();

    config = $.extend(true, {}, {
        widget: {
            switchMode: jh.fn.fnFirstArg
        },
        el: $(jh.defConfig.container).get(0),
        id: "giaExamsView",
        status: status,
        host: jh.defConfig.host,
        setStatus: function (val) {
            status = view.status = val;
            return val;
        }
    });

    view = new (View.extend(config))();

    // List is required for .renderMenu()
    view.model.set({
        "ts": 1390417623744,
        "collection": [
            {
                "_id": "52dd5bcf7f608a961d00000b",
                "average": 24.08,
                "limit": 38,
                "name": "math",
                "total": 74,
                "type": "gia",
                "date": 1306958400000
            },
            {
                "_id": "52dd5e137f608a961d00000c",
                "average": 24.25,
                "limit": 36,
                "name": "math",
                "total": 74,
                "type": "gia",
                "date": 1338235200000
            }
        ]
    });

    describe("giaExamsView", function () {
        beforeEach(function () {
            //jh.prepareDOM();
        });
        afterEach(function () {
            //jh.clearDOM();
        });

        it("giaExamsView constructor existence check", function () {
            expect(!!View).toBe(true);
        });
        it("view existence", function () {
            expect(!!view).toBe(true);
        });
        it("title", function () {
            expect(view.title).toBe("giaTitle");
        });
    });

    jh.clearDOM();
});