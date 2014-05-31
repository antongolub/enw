/*globals require, define, module, $*/

define(function (require) {
    'use strict';

    var emptyFunction = function () {};

    return {
        prepareDOM: function () {
            $('body').append('<div id="widgetContainer"></div>');
        },
        clearDOM: function () {
            $("body").html("");
        },
        defWidget: function (App) {
            if (typeof App === "function") {
                return new App(this.defConfig);
            }
        },
        defConfig: {
            type: "gia",
            host: "school.elasticnode.ru",
            container: "#widgetContainer"
        },
        fakeView: {
            undelegateEvents: emptyFunction,
            remove: emptyFunction,
            $el: {
                detach: emptyFunction,
                unbind: emptyFunction,
                size: function () {return 1; },
                remove: emptyFunction
            },
            switchModeDelayed: emptyFunction,
            modelInit: emptyFunction,
            render: emptyFunction,
            renderTitle: emptyFunction
        },
        fakeModel: {
            instanceUrl: "school.elasticnode.ru"
        },
        fn: {
            fn0: function () {return 0; },
            fn1: function () {return 1; },
            fnTrue: function () {return true; },
            fnFalse: function () {return false; },
            fnFirstArg: function (param) {return param; },
            empty: emptyFunction
        }
    };
});