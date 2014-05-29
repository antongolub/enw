/*globals define, test, equal, ok, $, describe, it, beforeEach, afterEach, expect, window*/
/*jslint nomen: true, debug: true, bitwise: true, todo: true */

define(function (require) {
    'use strict';

    var jh = require('tests/_helpers/jasmineHelper'),
        Backbone = require('backbone'),
        _ = require("underscore"),
        View = require('views/defaultView'),
        Model = require("models/defaultModel"),
        status,
        mode = {
            test: "test"
        },
        view,
        config = $.extend(true, {}, {
            id: 'enw' + (100000 * Math.random() | 0),
            status: status,
            mode: mode,
            setStatus: function (val) {
                status = view.status = val;
                return val;
            },
            testmodel: new Model({key: "test"})
        }, jh.defConfig);

    view = new (View.extend(config))();

    describe("defaultView inners test", function () {

        beforeEach(function () {
            jh.prepareDOM();
        });
        afterEach(function () {
            jh.clearDOM();
        });
        it("defaultView constructor existence", function () {
            expect(!!View).toBe(true);
        });
        it("view existence", function () {
            expect(!!view).toBe(true);
        });
        it("view setStatus", function () {
            expect(config.setStatus(3)).toBe(view.status);
        });
        it("view modelInit", function () {
            var attr = {
                key: "value"
            };
            // If model exists, check its data
            expect(view.modelInit({}, Model, "testmodel", attr).get("key")).toBe("value");
        });
        it("view renderData function should exist and should return something back", function () {
            expect(typeof view.renderData === "function" && !!view.renderData()).toBe(true);
        });
        // Title should always be rendered
        it("Title render test", function () {
            var title = "test";
            expect(view.renderTitle()).toBe(undefined);
            expect(view.renderTitle(title)).toBe(title);

            // The previous non-empty title should be restored
            expect(view.renderTitle()).toBe(title);
        });
        it("'In-progress' state indication", function () {
            expect(view.setIndicator(2)).toBe(true);
            expect(view.setIndicator(1)).toBe(false);

            config.setStatus(2);
            expect(view.setIndicator()).toBe(true);
        });
        it("successCb", function () {
            var model = jh.fakeModel;
            // Error occurred
            expect(view.successCb(model, {
                error: "error"
            })).toBe(false);

            // Empty collection returned
            expect(view.successCb(model, {
                collection: []
            })).toBe(false);

            // Correct response
            expect(view.successCb(model, {
                collection: ["test"]
            })).toBe(true);
        });
        it("errorCb", function () {
            // Error handler always return true
            expect(view.errorCb()).toBe(true);
        });
        it("selectMenuItem", function () {
            // When nothing to select returns false
            expect(view.selectMenuItem()).toBe(false);
            expect(view.selectMenuItem($("nothing"))).toBe(false);

            // If we have at least one real DOM element ($-wrapped) in arguments
            expect(view.selectMenuItem($("body"))).toBe(true);
            expect(view.selectMenuItem(undefined, $("body"))).toBe(true);
        });
        it("renderMenu", function () {
            // If nothing was rendered
            expect(view.renderMenu()).toBe(false);

            view.$el.append("<menu></menu>");
            // When new DOM elements have been added
            expect(view.renderMenu([], "menu")).toBe(true);
        });
        it("setMode", function () {
            // In case of empty arguments it returns false (nothing to change)
            expect(_.isEqual(view.setMode(), mode)).toBe(false);

            // New state applied in array form
            var testvalue = "newtest";
            expect(view.setMode(testvalue).test).toBe(testvalue);

            // Settings object injection
            expect(view.setMode({test: "test"}).test).toBe("test");

        });
        it("switchModeDelayed", function () {
            // Empty params - false as response
            expect(view.switchModeDelayed()).toBe(false);

            // Arguments for delayed call 
            view.delayedSetModeArgs = ["test"];
            // Callback
            view.switchMode = jh.fn.fnFirstArg;

            expect(view.switchModeDelayed()).toBe(true);

        });
        it("showMsg", function () {
            expect(view.showMsg()).toBe();

            // view.showMessage is view.showMsg alias
            // As msg code
            expect(view.showMessage("notFound")).toBe("notFoundMsg".toLocaleString());
        });
        it("initRelatedView", function () {
            // Node element for related view
            view.$el.append("<div class='related'></div>");

            // All three arguments are required
            expect(view.initRelatedView()).toBe();
            expect(view.initRelatedView("inner")).toBe();
            expect(view.initRelatedView("inner", Backbone.View)).toBe();

            // Should return initialized view
            expect(!!view.initRelatedView("inner", Backbone.View, ".related")).toBe(true);
        });
        it("switchRelatedView", function () {
            // The 1st argument should be $-object 
            expect(view.switchRelatedView()).toBe(false);

            // If $object exists new class should be appended
            expect(view.switchRelatedView($("body"), "test").is(".test")).toBe(true);

        });

    });
});
