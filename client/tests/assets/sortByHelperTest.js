/*globals define, test, equal, ok, $, describe, it, beforeEach, afterEach*/
/*jslint nomen: true, debug: true, bitwise: true, todo: true */

define(function (require) {
    'use strict';
    var _ = require('underscore'),
        jh = require('tests/_helpers/jasmineHelper'),
        helper = require('assets/sortByHelper');


    describe("sortByHelperTest", function() {
        
        it("sortByHelper existence", function() {
            expect(!!helper).toBe(true);
        });

        it("SortBy check", function() {
            var listIn = [
                    {name: "3"},
                    {name: "1"},
                    {name: "2"}
                ],
                listOut = [
                    {name: "1"},
                    {name: "2"},
                    {name: "3"}
                ];
            
            // With options
            expect(_.isEqual(
                helper(listIn, "name", false, false, {fn:jh.fn.fnFirstArg}),
                listOut
            )).toBe(true);
            
            // And without
            expect(_.isEqual(
                helper(listIn, "name"),
                listOut
            )).toBe(true);
        });
    })
});
