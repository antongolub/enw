/*global require, define, document, $, console, window */
/*jslint nomen: true, debug: true, bitwise: true, todo: true*/

/**
 * @module App
 */

define([
    "framework",
    "underscore",
    "backbone",

    "modules/mainPack"
],
    /**
     * Widget constructor class
     * @name ElascticnodeWidget
     * @requires framework {Object} jQuery|Zepto
     * @requires underscore {Object} Underscore
     * @requires backbone {Object} Backbone
     * @requires module:mainPack {Object} Loader dependent modules
     * @class Widget
     * @param config {Object} Init config object
     * @constructor
     * @return {Object} Widget constructor
     * @see module:App
     */
        function ($, _, Backbone) {
        "use strict";

        return function (config) {
            /**
             * @name module:App#config
             * @memberof module:App
             * @inner
             * @example config = {
             *   type: "exams",
             *   interval: 10,
             *   host: "school.elasticnode.ru",
             *   container: "body",
             *   title: "My title",
             * }
             * */
            var self = this,
                status = 0,
                id = 'enw' + (100000 * Math.random() | 0),
                path,
                pack,
                view = {},
                setStatus = function (val) {
                    /*
                     * -1 error
                     * 0 waiting
                     * 1 rendered
                     * 2 data fetched
                     */
                    status = view.status = val;

                    return val;
                },
                /**
                 * @name module:App#renderer
                 * @description View render function
                 * @memberof module:App
                 * @function renderer
                 * @inner
                 */
                renderer,
                /**
                 * @name module:App#flushView
                 * @description Assigned view destructor
                 * @memberof module:App
                 * @function flushView
                 * @param view {Object} Backbone.View instance
                 * @inner
                 */
                flushView = function (view) {
                    if (view && view.$el) {
                        view.undelegateEvents();
                        view.$el.unbind();

                        //Removes view from DOM
                        view.$el.remove();
                        view.remove();
                        Backbone.View.prototype.remove.call(view);
                        view = {};
                        return true;
                    }
                    return false;
                },
                /**
                 * @name module:App#loadRenderer
                 * @description Loads the view.render instance as renderer
                 * @param path {String} Module related path
                 * @memberof module:App
                 * @function loadRenderer
                 * @inner
                 */
                loadRenderer = function (path, pack) {
                    var cb = function () {
                        if (path) {
                            cb = function (viewConstructor) {
                                /* istanbul ignore else */
                                if (viewConstructor) {
                                    // Previous view annihilation
                                    flushView(view);
                                    setStatus(0);

                                    view = new (viewConstructor.extend({
                                        el: config.$container.get(0),
                                        id: id,
                                        status: status,
                                        host: config.host,
                                        title: config.title || viewConstructor.prototype.title,
                                        setStatus: setStatus,
                                        delayedSetModeArgs: [].concat(config.mode || view.delayedSetModeArgs)
                                    }))();

                                    renderer = $.proxy(view.render, view.self);
                                    renderer();
                                }
                                return renderer;
                            };
                            require([path], cb);
                            return cb;
                        }
                        return;
                    };
                    // If view module is a part of some package

                    if (pack) {
                        require([pack], cb);
                    } else {
                        cb();
                    }
                    return cb;
                },
                /**
                 * @name module:App#Loader
                 * @description Returns or creates a new one renderer instance
                 * @memberof module:App
                 * @function Loader
                 * @inner
                 */
                Loader = function () {
                    return function () {
                        return loadRenderer(path, pack);
                    };
                },
                /**
                 * @name module:App#validateConfig
                 * @description Validates config object and handles its errors
                 * @memberof module:App
                 * @function validateConfig
                 * @param [_config] {Object} Config object. If undefined actual config will be used
                 * @inner
                 * @returns {Object} Correct config or error object
                 */
                validateConfig = function (_config) {
                    _config = _.extend({}, config, _config);

                    var errCode = null,
                        allowedTypes = ["gia", "ege", "sou"];


                    // At first we need to check out if widget type is allowed
                    if (!!_config.type && !_.contains(allowedTypes, _config.type)) {
                        errCode = 1;
                    }
                    // If host is undefined
                    if (!_config.host) {
                        errCode = 3;
                    }

                    // Self-update interval should be correct
                    if (_config.interval && _config.interval > 0) {
                        if (_config.interval < 5) {
                            _config.interval = 5;
                            console.warn("Too short interval. It should be at least 5m or 0 if you don't need autoupdate");
                        }
                    }
                    _config.$container = $(_config.container).eq(0);
                    // Parent existence check
                    if (!_config.$container.length) {
                        errCode = 2;
                    }

                    switch (_config.type) {
                    case "gia":
                        path = 'views/exams/giaExamsView';
                        pack = "modules/examsModule";
                        break;
                    case "ege":
                        path = 'views/exams/examsView';
                        pack = "modules/examsModule";
                        break;
                    case "sou":
                        path = 'views/sou/souView';
                        pack = "modules/souModule";
                        break;
                    }
                    if (errCode) {
                        setStatus(-1);
                        console.warn("Invalid config. See elasticnode.ru/widgets/#error" + errCode + " for details");
                        return {error: errCode};
                    }
                    return _config;

                },
                /**
                 * @name module:App#applyConfig
                 * @description Applies new config to current widget
                 * @memberof module:App
                 * @function applyConfig
                 * @param [config] {Object} Config object
                 * @inner
                 */
                applyConfig = function (_config, view) {
                    _config = validateConfig(_config);
                    if (!_config.hasOwnProperty("error") && !_.isEqual(_config, config)) {
                        // console.log("Config looks fine (id: " + id + ")");

                        // In case of type mismatch widget should be completely re-rendered
                        if (config.type !== _config.type) {
                            config = _config;
                            renderer = new Loader();
                        } else {
                            // if rendered
                            if (view.$el) {
                                // It title was changed
                                if (_config.title && view.title !== _config.title) {
                                    view.title = _config.title;
                                    view.renderTitle();
                                }
                                // Container was changed
                                if (config.$container.get(0) !== _config.$container.get(0)) {
                                    _config.$container.after(view.$el.detach());
                                }
                                // Todo: timeouts should be defined
                                view.interval = _config.interval;
                            }


                            // config.host influences on view.model
                            if (_config.host && config.host !== _config.host) {
                                view.host = _config.host;
                                /**
                                 * @see module:defaultView#modelInit
                                 */
                                view.modelInit();
                            }
                            config = _config;
                        }
                        // Delayed mode set
                        view.delayedSetModeArgs = [].concat(_config.mode);

                        // view.render() link
                        renderer();
                    }
                    return _config;
                };
            renderer = new Loader();
            // Public methods goes here

            /**
             * @name module:App#getStatus
             * @description Returns current widget status
             * @memberof module:App
             * @function getStatus
             */
            self.getStatus = function () {
                return status;
            };
            /**
             * @name module:App#getNode
             * @description Returns view.$el if exists or null
             * @memberof module:App
             * @function getNode
             * @returns {object|null} $container or null
             */
            self.getNode = function () {
                return view.$el || null;
            };
            /**
             * @name module:App#setConfig
             * @description Sets a new widget config
             * @memberof module:App
             * @function setConfig
             * @param config {Object} Config object
             */
            self.setConfig = function (_config) {
                return applyConfig(_config, view);
            };
            /**
             * @name module:App#setMode
             * @description Asynchronous widget mode set
             * @memberof module:App
             * @see module:defaultView#setMode
             * @function
             * @param arguments {*} Any arguments
             * @returns {boolean} True if .switchModeDelayed() method defined
             */
            self.setMode = function () {
                view.delayedSetModeArgs = arguments;
                if (view.switchModeDelayed) {
                    view.switchModeDelayed();
                    return true;
                }
                return false;
            };

            // Widget destructor
            /**
             * @name module:App#destroy
             * @description Widget annihilation
             * @memberof module:App
             * @function destroy
             * @returns {string} Message
             */
            self.destroy = function () {
                flushView();
                var key;
                //TODO clearTimeout
                for (key in this) {
                    /* istanbul ignore else */
                    if (this.hasOwnProperty(key)) {
                        delete this[key];
                    }
                }
                self.ptototype = {};
                setStatus(-1);
                // NB: destroyed object cannot be used anymore
                return "Completely destroyed view and object methods (id: " + id + ")";
            };

            // Alive!
            applyConfig(undefined, view);


            // UNIT TEST HELPERS
            self.__testonly__ = {
                applyConfig: applyConfig,
                validateConfig: validateConfig,
                setView: function (_view) { view = _view; return view; },
                getView: function () {return view; },
                getRenderer: function () {return renderer; },
                getConfig: function () {return config; },
                Loader: Loader,
                loadRenderer: loadRenderer,
                flushView: flushView,
                setStatus: setStatus
            };
        };
    });