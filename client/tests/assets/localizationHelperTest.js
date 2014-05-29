/*globals define, test, equal, ok, $, describe, it, beforeEach, afterEach*/
/*jslint nomen: true, debug: true, bitwise: true, todo: true */

define(function (require) {
    'use strict';
    var _ = require('underscore'),
        jh = require('tests/_helpers/jasmineHelper'),
        helper = require('assets/localizationHelper'),
        l10n = require("l10n");


    describe("localizationHelperTest", function() {
        
        it("localizationHelper existence", function() {
            expect(!!helper).toBe(true);
        });
        
        it("localization pair test", function() {
            // Test dictionary
            String.toLocaleString({
                "en": {
                    "t": "test"
                },
                "ru": {
                    "t": "тест"
                }
            });
            expect(helper("t")).toBe("t".toLocaleString());
        });
        
        it("localization with options param", function() {
            var options = {
                fn: jh.fn.fnFirstArg
            };
            expect(helper("t", options)).toBe("t".toLocaleString());
        });
    })
});