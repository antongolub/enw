/*globals define, test, equal, ok, $, describe, it, beforeEach, afterEach, expect, window, console*/
/*jslint nomen: true, debug: true, bitwise: true, todo: true */

define(function (require) {
    'use strict';
    var jh = require('tests/_helpers/jasmineHelper'),
        Backbone = require('backbone'),
        View = require('views/population/populationView'),
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
        "ts": 1390155724351,
        "collection": [
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
        ]
    });

    describe("populationView tests", function () {
        beforeEach(function () {
            //jh.prepareDOM();
        });
        afterEach(function () {
            //jh.clearDOM();
        });

        it("populationView constructor existence check", function () {
            expect(!!View).toBe(true);
        });
        it("view existence", function () {
            expect(!!view).toBe(true);
        });

        it("related view switch", function () {
            // Subview should be rendered for any mode state
            view.render();

            /*view.mode = {
             year: 2012
             };
             expect(view.getRelatedView().$el.is(".yearChart")).toBe(true);*/
            view.mode = {
                year: "avg"
            };
            expect(view.getRelatedView().$el.is(".avgChart")).toBe(true);

        });

        // Check if menu item click handler generate correct mode objects
        it("view.onMenuClick", function () {
            var MENU_CLASS = ".enw__menu",
                e = {
                    target: view.$el
                        .find(MENU_CLASS)
                        .append("<a data-href='2012'></a>")
                        .children().eq(0)
                };

            // Should be equal 2 - handler availability marker
            view.status = 2;
            // Primary menu click
            expect(view.onMenuClick(e)).toBe(2012);

        });

        it("view.switchMode()", function () {
            // We have mode = {subject: 'history', year: 2012} from previous test
            // Data transport emulation

            var data = {
                    "_id": "52dc10c25e4a3ce50b0004bc",
                    "population": {
                        "overall": 762,
                        "total": [78, 76, 75, 75, 74, 72, 73, 73, 74, 44, 48],
                        "female": [38, 42, 38, 39, 42, 37, 41, 37, 40, 26, 28],
                        "male": [40, 34, 37, 36, 32, 35, 32, 36, 34, 18, 20]
                    }
                },
                model = view.model;

            model.instanceUrl = model.host + "/" + model.path + "/" + 2013;
            view.status = 2;
            model.set(data);
            utils.setToCache(model.instanceUrl, data);

            //view.mode.year = 2013;

            // Data should be fetched from cache
            expect(!!view.switchMode(2013)).toBe(true);
        });

        it("view.renderData()", function () {
            view.status = 1;
            view.render();

            // Set data
            view.model.set({
                "ts": 1390155724351,
                "collection": [
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
                ]
            });

            // Then check it
            expect(view.renderData().collection[1].population.overall).toBe(762);
        });
    });
});