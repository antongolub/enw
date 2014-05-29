/*globals define, test, equal, ok, $, describe, it, beforeEach, afterEach, expect, window, console*/
/*jslint nomen: true, debug: true, bitwise: true, todo: true */

define(function (require) {
    'use strict';
    var jh = require('tests/_helpers/jasmineHelper'),
        Backbone = require('backbone'),
        View = require('views/exams/examsView'),
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
        id: "examsViewTest",
        status: status,
        host: jh.defConfig.host,
        title: "testTitle",
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

    describe("examsView tests", function () {
        beforeEach(function () {
            //jh.prepareDOM();
        });
        afterEach(function () {
            //jh.clearDOM();
        });

        it("examsView constructor existence check", function () {
            expect(!!View).toBe(true);
        });
        it("view existence", function () {
            expect(!!view).toBe(true);
        });

        it("related view switch", function () {
            // Subview should be rendered for any mode state
            view.render();

            view.mode = {
                subject: "math",
                year: 2012
            };
            expect(view.getRelatedView().$el.is(".subjectYearChart")).toBe(true);
            view.mode = {
                subject: "math",
                year: "yearSlice"
            };
            expect(view.getRelatedView().$el.is(".subjectChart")).toBe(true);
            view.mode = {
                subject: "avg",
                year: 2011
            };
            expect(view.getRelatedView().$el.is(".avgYearTable")).toBe(true);
            view.mode = {
                subject: "avg",
                year: "yearSlice"
            };
            expect(view.getRelatedView().$el.is(".avgChart")).toBe(true);
        });

        // Check if menu item click handler generate correct mode objects
        it("view.onMenuClick", function () {
            var MENU_PRIMARY_CLASS = ".enw__menu--primary",
                MENU_SECONDARY_CLASS = ".enw__menu--secondary",
                $primaryMenu = view.$el.find(MENU_PRIMARY_CLASS),
                $secondaryMenu = view.$el.find(MENU_SECONDARY_CLASS),
                e = {
                    target: $primaryMenu.append("<a data-href='history'></a>").children().eq(0)
                };

            // Should be equal 2 - handler availability marker
            view.status = 2;
            // Primary menu click
            expect(view.onMenuClick(e)).toBe('history');

            // Secondary menu click
            view.status = 2;
            e.target = $secondaryMenu.append("<a data-href='2012'></a>").children().eq(0);
            expect(view.onMenuClick(e)).toBe(2012);

        });
        it("view.switchMode()", function () {
            // We have mode = {subject: 'history', year: 2012} from previous test
            // Data transport emulation

            var data = {
                "__v": 0,
                "_id": "52e010d339a80c6540000051",
                "average": 69.32,
                "averageCity": 69.12,
                "averageCountry": 69.87,
                "averageRegion": 69.07,
                "belowThreshold": 0,
                "bullseye": 1,
                "excellent": 5,
                "excellentThreshold": 68,
                "gtotal": 46,
                "limit": 100,
                "maximum": 100,
                "minimum": 40,
                "name": "history",
                "path": "exams/ege/history/2012",
                "threshold": 32,
                "total": 15,
                "type": "ege",
                "unique": 9,
                "hits": 21,
                "date": 1338148800000
            };

            view.status = 2;
            view.model.set(data);
            utils.setToCache(view.model.instanceUrl, data);

            view.mode.subject = "test";

            // Data should be fetched from cache
            expect(!!view.switchMode("history", 2012)).toBe(true);
        });
        it("view.renderData()", function () {
            view.status = 1;
            view.render();

            // Set data
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

            // Then check it
            expect(view.renderData().collection[0].limit).toBe(38);
            view.mode = {
                subject: "math",
                year: 2012
            };
            view.model.set({
                "ts": 1000,
                "collection": undefined
            });
            expect(view.renderData().ts).toBe(1000);
        });

    });
});