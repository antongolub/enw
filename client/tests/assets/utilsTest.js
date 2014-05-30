/*globals define, test, equal, ok, $, describe, it, beforeEach, afterEach, expect, window*/
/*jslint nomen: true, debug: true, bitwise: true, todo: true */

define(function (require) {
    'use strict';
    var _ = require('underscore'),
        utils = require('utils');


    describe("Utils", function () {

        it("Utils existence", function () {
            expect(!!utils).toBe(true);
        });
        it("replace", function () {
            expect(utils.replace("test", "e")).toBe("test");
            expect(utils.replace("test", "e", "o")).toBe("tost");
            expect(_.isEqual(utils.replace([1, 2, 3], 2, 5), [1, 5, 3])).toBe(true);
        });
        it("strictBool", function () {
            expect(utils.strictBool(true)).toBe(true);
            expect(utils.strictBool(false)).toBe(false);
            expect(utils.strictBool(false, true)).toBe(false);
            expect(utils.strictBool("false", true)).toBe(true);
            expect(utils.strictBool(0, true)).toBe(true);
            expect(utils.strictBool(true, false)).toBe(true);
        });
        it("sizeOf", function () {
            var test = "test";

            expect(utils.sizeOf(true)).toBe(4);
            expect(utils.sizeOf(1)).toBe(8);
            expect(utils.sizeOf("test")).toBe(8);
            expect(utils.sizeOf({})).toBe(0);
            expect(utils.sizeOf({test: "test"})).toBe(16);
            expect(utils.sizeOf({testtest: "test"})).toBe(24);
            expect(utils.sizeOf({testtest: test, test: test})).toBe(32);

        });
        it("sum", function () {

            expect(utils.sum()).toBe(0);
            expect(utils.sum("test")).toBe(0);
            expect(utils.sum([1, 2, 3])).toBe(6);
        });
        it("sortBy", function () {
            var compare = function () {
                var params = Array.prototype.slice.call(arguments),
                    toBe = params.shift();

                return _.isEqual(utils.sortBy.apply(this, params), toBe);
            }, f1, f2, f3;
            // Non-objects are being return as is
            expect(compare([3, 1, 2], [3, 1, 2])).toBe(true);

            // by attribute
            expect(compare(
                [
                    {name: "a"},
                    {name: "b"},
                    {name: "c"}
                ],
                [
                    {name: "c"},
                    {name: "a"},
                    {name: "b"}
                ],
                "name"
            )).toBe(true);

            // by attribute with injection
            expect(compare(
                [
                    {name: "yearSlice".toLocaleString()},
                    {name: "b"},
                    {name: "c"}
                ],
                [
                    {name: "c"},
                    {name: "yearSlice".toLocaleString()},
                    {name: "b"}
                ],
                "name",
                null,
                true
            )).toBe(true);

            // by undefined attribute
            expect(compare(
                [
                    {name: "a"},
                    {name: "b"},
                    {name: "c"}
                ],
                [
                    {name: "c"},
                    {name: "a"},
                    {name: "b"}
                ],
                "param"
            )).toBe(false);

            f1 = function () {return 1; };
            f2 = function () {return 2; };
            f3 = function () {return 3; };

            // by methods
            expect(compare(
                [
                    {name: f1},
                    {name: f2},
                    {name: f3}
                ],
                [
                    {name: f3},
                    {name: f1},
                    {name: f2}
                ],
                "name"
            )).toBe(true);

            // by undefined param
            expect(compare(
                [
                    {name: "a"},
                    {name: "b"},
                    {name: "c"}
                ],
                [
                    {name: "c"},
                    {name: "a"},
                    {name: "b"}
                ],
                true,
                "param"
            )).toBe(false);

            // Incorrect input
            expect(compare(
                [
                    {name: "a"},
                    {name: "b"},
                    {name: "c"}
                ],
                [
                    {name: "c"},
                    {name: "a"},
                    {name: "b"}
                ],
                true,
                true
            )).toBe(false);
        });

    });
    // Cache testing
    describe("Utils:cache", function () {
        var scope = {};

        it("Check cache object type", function () {
            expect(typeof utils.getCacheScope() === "object").toBe(true);
        });

        it("Get default cache scope", function () {
            expect(utils.getCacheScope() === window.Enw).toBe(true);
        });

        it("Get cache scope by object", function () {
            expect(utils.getCacheScope(scope) === scope).toBe(true);
        });

        it("Get & set cache size", function () {
            var mb = 1024 * 1024;

            expect(utils.getCacheSize(scope)).toBe(undefined);
            expect(utils.setCacheSize(5, scope)).toBe(5);

            // Default cache size: 0.25 Mb for 32bit and 1Mb for x64
            expect(utils.getCacheSize()).toBe((utils.isx64() ? 1 : 0.25) * 1024 * 1024);

            // We can replace x64 detection with additional param
            expect(utils.setCacheSize(undefined, {}, false)).toBe(0.25 * 1024 * 1024);
            expect(utils.setCacheSize(undefined, {}, true)).toBe(1024 * 1024);

            // Cache validation
            expect(utils.setCacheSize(0)).toBe(0);
            expect(utils.setCacheSize(-5)).toBe(0);

            // 20Mb is a limit
            expect(utils.setCacheSize(40 * mb)).toBe(20 * mb);
        });

        it("Cache 'CRUD'", function () {
            var scope = {},
                array = new Array(70),
                array2 = new Array(80),
                num = 1234,
                longString = array.join("test"),
                newString = array2.join("long"),
                giantString = longString + newString,
                rest,
                size = utils.sizeOf(longString);

            // Set cache size in bytes
            expect(utils.setCacheSize(1024, scope)).toBe(1024);

            // Check its size
            expect(utils.getCacheRest(scope)).toBe(1024);

            // Get cache rest
            expect(utils.getCacheRest(scope)).toBe(1024);

            // Store an object
            expect(utils.setToCache("long", longString, scope)).toBe(longString);

            // Get it back
            expect(utils.getFromCache("long", scope) === longString).toBe(true);

            // Check cache rest
            expect(utils.getCacheRest(scope)).toBe(1024 - size);





            // Let's try to save an object larger than cache
            expect(utils.setToCache("giant", giantString, scope)).toBe(giantString);

            // It shouldn't be stored
            expect(utils.getFromCache("giant", scope) === giantString).toBe(false);

            // Cache rest equals the previous
            expect(utils.getCacheRest(scope)).toBe(1024 - size);

            // Set num to cache
            expect(utils.setToCache("num", num, scope)).toBe(num);
            expect(utils.getCacheRest(scope)).toBe(1024 - size - utils.sizeOf(num));





            // Now we're taking an attempt to write something bigger than cache rest, but less than cache size
            expect(utils.setToCache("new", newString, scope)).toBe(newString);

            // Previously cached items should be remove to get an extra space for a "new"
            expect(utils.getCacheRest(scope)).toBe(1024 -  utils.sizeOf(num) - utils.sizeOf(newString));

            // longString has been removed
            expect(utils.getFromCache("long", scope) === longString).toBe(false);

            // but num is still here
            expect(utils.getFromCache("num", scope)).toBe(num);



            // Rewrite and deleteFrom
            expect(utils.setToCache("new", num, scope)).toBe(num);
            // Num is stored twice
            expect(utils.getFromCache("new", scope) === utils.getFromCache("num", scope)).toBe(true);
            // Cache rest check
            expect(utils.getCacheRest(scope)).toBe(1024 - 2 * utils.sizeOf(num));

            // Remove "num"
            expect(utils.delFromCache("new", scope)).toBe(undefined);
            expect(utils.getFromCache("new", scope)).toBe(undefined);
            expect(utils.getCacheRest(scope)).toBe(1024 - utils.sizeOf(num));


            // flush
            expect(utils.flushCache(scope)).toBe(undefined);
            expect(utils.getFromCache("num", scope)).toBe(undefined);


        });

    });

});
