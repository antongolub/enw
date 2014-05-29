/*globals define, test, equal, ok, $, describe, beforeEach, afterEach, it, expect*/
/*jslint nomen: true, debug: true, bitwise: true, todo: true */

define(function (require) {
    'use strict';

    var jh = require('tests/_helpers/jasmineHelper'),
        App = require('App'),
        Backbone = require('backbone'),
        DefaultView = require('views/defaultView'),
        renderer;



    describe("Widget instance: construction", function () {
        beforeEach(function () {
            jh.prepareDOM();
            // Default configured widget instance
            this.widget = jh.defWidget(App);
            this.view = this.widget.__testonly__.getView();
        });
        afterEach(function () {
            jh.clearDOM();
            this.widget = this.view = undefined;
        });
        it("Constructor load", function () {
            // Constructor
            expect(!!App).toBe(true);
            expect(!!this.widget).toBe(true);
        });

        it("View generation check", function () {
            expect(this.view  instanceof Object).toBe(true);
        });
        it("Renderer existance test", function () {
            renderer = this.widget.__testonly__.getRenderer();
            expect(typeof renderer).toBe("function");
        });

        it("LoadRenderer deep inspection", function () {
            var loadRenderer = this.widget.__testonly__.loadRenderer,
                path = "views/exams/examsView",
                pack = path,
                view,
                cb;

            expect(typeof loadRenderer).toBe("function");

            // Empty path should return undefined 
            cb = loadRenderer();
            expect(cb()).toBe();

            // Otherwise, we get a callback
            cb = loadRenderer(path);
            expect(typeof cb).toBe("function");

            // The same if we need to load module from package
            cb = loadRenderer(path, pack);
            expect(typeof cb).toBe("function");

            // Which finally gives a Backbone.View constructor
            cb = cb();
            expect(typeof cb).toBe("function");

            // Loader should returns View.render
            renderer = cb(DefaultView);
            expect(typeof renderer).toBe("function");

            // Renderer should return view instance
            view = renderer();
            expect(view instanceof DefaultView).toBe(true);
        });
    });

    describe("Widget instance: public methods", function () {
        beforeEach(function () {
            jh.prepareDOM();
            // Default configured widget instance
            this.widget = jh.defWidget(App);
            this.view = this.widget.__testonly__.getView();
        });
        afterEach(function () {
            jh.clearDOM();
            this.widget = this.view = undefined;
        });
        it("Widget type change on fly", function () {
            expect(this.widget.setConfig({type: "ege"}).type)
                .toBe("ege");
        });
        it("Widget status check", function () {
            expect(this.widget.getStatus())
                .toBe(0);
        });
        it("Widget view link check", function () {
            // Should return directly null as far View is not inialized yet
            expect(this.widget.getNode())
                .toBe(null);
        });
        it("Set mode API", function () {
            // Return true if setMode API is available, otherwise - false
            // NB: This behaviour depends from view.switchModeDelayed() method
            // So this should return false
            expect(this.widget.setMode()).toBe(false);
            this.widget.__testonly__.setView(jh.fakeView);
            
            // And true is expected here
            expect(this.widget.setMode()).toBe(true);
        });
        it("Destructor", function () {
            this.widget.__testonly__.setView(jh.fakeView);

            // Destroyer always returns true
            // And there's no way back from here
            expect(!!this.widget.destroy()).toBe(true);
            
            // For example, widget.getNode is undefined
            expect(!this.widget.getNode).toBe(true);
            
        });
    });
    describe("Widget instance: private methods", function () {
        beforeEach(function () {
            jh.prepareDOM();
            this.widget = jh.defWidget(App);
            this.view = this.widget.__testonly__.getView();
        });
        afterEach(function () {
            jh.clearDOM();
            this.widget = this.view = undefined;
        });
        it("Flush view", function () {
            // If view param is empty should return false
            expect(this.widget.__testonly__.flushView()).toBe(false);

            // If not, true is expected
            expect(this.widget.__testonly__.flushView(new DefaultView())).toBe(true);
        });
        // Set widget status
        it("Widget status set", function () {
            expect(this.widget.__testonly__.setStatus(1))
                .toBe(1);
        });
        it("Config validation", function () {
            // Incorrect type
            expect(
                this
                    .widget
                    .__testonly__
                    .validateConfig({
                        type: "unsupported"
                    }).error
            ).toBe(1);

            // Timeout correction check
            // 0 < t < 5 -> 5
            expect(
                this
                    .widget
                    .__testonly__
                    .validateConfig({
                        interval: 3
                    }).interval
            ).toBe(5);

            // t = 0  -> 0
            expect(
                this
                    .widget
                    .__testonly__
                    .validateConfig({
                        interval: 0
                    }).interval
            ).toBe(0);

            // t > 5
            expect(
                this
                    .widget
                    .__testonly__
                    .validateConfig({
                        interval: 10
                    }).interval
            ).toBe(10);

            // Empty DOM contaner
            expect(
                this
                    .widget
                    .__testonly__
                    .validateConfig({
                        container: ""
                    }).error
            ).toBe(2);

            // Invalid hostname
            expect(
                this
                    .widget
                    .__testonly__
                    .validateConfig({
                        host: ""
                    }).error
            ).toBe(3);

            // Valid widget type
            expect(
                this
                    .widget
                    .__testonly__
                    .validateConfig({
                        type: "sou"
                    }).type
            ).toBe("sou");
        });
        it("Apply config", function () {
            // Incorrect config input returns error object
            expect(this.widget.__testonly__.applyConfig({
                error: "error"
            }).error).toBe("error");

            // New title shoud be applied
            expect(this.widget.__testonly__.applyConfig({
                title: "new"
            }, jh.fakeView).title).toBe("new");


            // New container should be set
            var view = jh.fakeView,
                id = "widgetContainer2",
                host = "hostname",
                selector = "#" + id;

            $('body').append('<div id="' + id + '"></div>');

            expect(this.widget.__testonly__.applyConfig(
                {container: selector},
                view
            ).container).toBe(selector);

            // Hostname set check
            expect(this.widget.__testonly__.applyConfig(
                {host: host},
                view
            ).host).toBe(host);
        });
        it("Getting default config which should be an object", function () {
            expect(typeof this.widget.__testonly__.getConfig() === "object")
                .toBe(true);
        });
    });
});
