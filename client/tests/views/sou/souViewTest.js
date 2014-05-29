/*globals define, test, equal, ok, $, describe, it, beforeEach, afterEach, expect, window, console*/
/*jslint nomen: true, debug: true, bitwise: true, todo: true */

define(function (require) {
    'use strict';
    var jh = require('tests/_helpers/jasmineHelper'),
        Backbone = require('backbone'),
        View = require('views/sou/souView'),
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
        id: "souView",
        status: status,
        host: jh.defConfig.host,
        setStatus: function (val) {
            status = view.status = val;
            return val;
        }
    });

    view = new (View.extend(config))();

    describe("souView", function () {

        it("souView constructor existence check", function () {
            expect(!!View).toBe(true);
        });
        it("view existence", function () {
            expect(!!view).toBe(true);
        });
        it("Title check", function () {
            expect(view.title).toBe("souTitle");
        });
        it(".render()", function () {
            expect(view.render()).toBe(view);
        });
        it(".renderData()", function () {
            expect(view.renderData()).toBe(view.model.attributes);

            var data = {
                ts: 1390155724351,
                unique: [
                    "algebra",
                    "english",
                    "math",
                    "russian",
                    "laborTechnology",
                    "physics",
                    "physicalTraining",
                    "french",
                    "chemistry",
                    "mechDrawing",
                    "calligraphy",
                    "reading"
                ],
                collection: [
                    {
                        _id: "52db8c576f60c9315a0000e1",
                        year: 2011,
                        indicator: {
                            quality: {
                                average: 66.35588777450619
                            }
                        }
                    },
                    {
                        _id: "52dc10c25e4a3ce50b0004bc",
                        year: 2012,
                        indicator: {
                            quality: {
                                average: 65.73041850439373
                            }
                        }
                    },
                    {
                        _id: "52dc17ccf7a43ccb0c00055d",
                        year: 2013,
                        indicator: {
                            quality: {
                                average: 65.95818246436909
                            }
                        }
                    }
                ]
            };
            // Save to cache
            utils.setToCache(view.model.url() + "/", data);

            // Update model
            view.model.set(data);
            expect(view.renderData().collection[0].year).toBe(2011);

            // Single subject
            data = {
                "ts": 1390155724351,
                "subtype": "math",
                "collection": [
                    {
                        "_id": "52db8c576f60c9315a0000e1",
                        "year": 2011,
                        "indicator": {
                            "quality": {
                                "average": 66.35588777450619,
                                "raw": [
                                    {
                                        "name": "math",
                                        "average": 64.86067415730336
                                    }
                                ]
                            }
                        }
                    },
                    {
                        "_id": "52dc10c25e4a3ce50b0004bc",
                        "year": 2012,
                        "indicator": {
                            "quality": {
                                "average": 65.73041850439373,
                                "raw": [
                                    {
                                        "name": "math",
                                        "average": 65.33555555555556
                                    }
                                ]
                            }
                        }
                    },
                    {
                        "_id": "52dc17ccf7a43ccb0c00055d",
                        "year": 2013,
                        "indicator": {
                            "quality": {
                                "average": 65.95818246436909,
                                "raw": [
                                    {
                                        "name": "math",
                                        "average": 65.0111111111111
                                    }
                                ]
                            }
                        }
                    }
                ]
            };
            // Update model
            view.model.set(data);
            expect(
                view
                    .renderData()
                    .collection[0]
                    .indicator
                    .quality
                    .raw[0]
                    .name
            ).toBe("math");
        });
        it("view.switchMode()", function () {
            // Should restore data from cache
            expect(view.switchMode("avg")).toBe("avg");
            // Should init new fetch
            expect(view.switchMode("math")).toBe("math");
        });
        // Check if menu item click handler generate correct mode objects
        it("view.onMenuClick", function () {
            var MENU_CLASSNAME = ".enw__menu",
                e = {
                    target: view.$el.find(MENU_CLASSNAME)
                        .prepend("<a data-href='russian'></a>")
                        .children().eq(0)
                };
            // Should be equal 2 - handler availability marker
            view.status = 2;
            expect(view.onMenuClick(e)).toBe('russian');

            view.setStatus(0);
            expect(view.onMenuClick(e)).toBe(undefined);

        });
    });
    jh.prepareDOM();
});