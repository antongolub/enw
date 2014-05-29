/*globals define, test, equal, ok, $, describe, it, beforeEach, afterEach*/
/*jslint nomen: true, debug: true, bitwise: true, todo: true */

define(function (require) {
    'use strict';
    var jh = require('tests/_helpers/jasmineHelper'),
        helper = require('assets/ifCondHelper');


    describe("ifCondHelperTest", function() {
        
        it("ifCondHelper existence", function() {
            expect(!!helper).toBe(true);
        });

        it("Condition check", function() {
            var options = {
                fn: jh.fn.fnTrue,
                inverse: jh.fn.fnFalse
            };

            expect(helper(1,1,options)).toBe(true);
            expect(helper(0,1,options)).toBe(false);
        });
    })
});
