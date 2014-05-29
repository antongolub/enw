/*global define, require, window, $, console */
/*jslint nomen: true, debug: true, bitwise: true, todo: true */

/**
 * @module defaultView
 */

define([
    "backbone",
    "handlebars",
    "models/defaultModel",
    "framework",
    "utils",
    "underscore",
    "assets/titleHelper",

    "assets/ifCondHelper",
    "assets/localizationHelper",
    "assets/menuHelper",
    "css!styles/style.css"
],
    function (Backbone, Handlebars, defaultModel, $, utils, _, titleTpl) {
        "use strict";

        /**
         * @name module:defaultView
         * @description Default widget view class
         * @extends Backbone.View
         * @class Backbone.View
         * @requires Backbone
         * @requires module:defaultModel
         * @see module:defaultModel
         * @requires framework
         * @requires Handlebars
         * @requires Requirejs text plugin
         * @constructor
         * @returns {Function} Backbone.View constructor
         */

        return Backbone.View.extend({
            /**
             * @name module:defaultView#initialize
             * @description Triggers model creation and self property definition
             * @function
             */
            initialize: function () {
                this.self = this;
                this.modelInit({
                    host: "http://" + this.host
                });

                this.setStatus = _.wrap(this.setStatus, function (setStatus, status) {
                    // Indicator depends on view.status
                    /* istanbul ignore else */
                    if (this.setIndicator) {
                        this.setIndicator(status);
                    }
                    return setStatus(status);
                });
                return this;
            },
            /**
             * @name module:defaultView#ModelConstructor
             * @description Default model constructor
             * @see module:defaultModel
             * @memberOf module:defaultView
             * @function
             */
            ModelConstructor: defaultModel,
            /**
             * @name module:defaultView#modelInit
             * @description Creates related model instance
             * @param ext {Object} Class extension object
             * @param [Model] {Function} Model class constructor. Equals this.ModelConstructor if undefined
             * @param [name] {String} Inner model property name. "model" if undefined
             * @param [attr] {Object} Attributes
             * @function
             */
            modelInit: function (ext, Model, name, attr) {
                var model;
                Model = Model || this.ModelConstructor;
                /* istanbul ignore else */
                if (Model) {
                    name = name || "model";
                    model = this[name];

                    if (model) {
                        // Status 0: rendered but model data is still not fetched
                        this.setStatus(1);

                        // Unbinding previous handlers
                        model.off("change");
                    }

                    // new Model instance
                    model = this[name] = new (Model.extend(ext))(typeof attr === "object" ? attr : {});


                    // Sets renderData as default model change event handler
                    model.on("change", this.renderData, this);
                }
                return model;
            },
            /**
             * @name module:defaultView#renderData
             * @description renderData "placeHolder"
             * @function
             */
            renderData: function () {
                return true;
            },
            /**
             * @name module:defaultView#render
             * @description Render template and append to DOM
             * .render() also calls this.update() after.
             * @function
             * @returns view {object} current view instance
             */
            render: function () {
                // If is not rendered yet
                if (this.status < 1) {
                    // Appending template to DOM
                    this.$el.append(Handlebars.compile(this.template || "")({
                        id: this.id
                    }));

                    // Reset element link from container
                    this.setElement(this.$el.find("#" + this.id));
                    this.setStatus(1);

                    // There's no way back if uncommented
                    delete this.template;
                    this.renderTitle();
                    this.afterRender();

                    this.afterRender = undefined;
                    this.setMode();
                }
                this.update();
                return this;
            },
            /**
             * @name module:defaultView#renderTitle
             * @description Renders widget title
             * Actually title can be placed in template, but in this case it couldn't be changed after
             * without full widget re-render
             * @param [title] New widget title
             * @function
             */
            renderTitle: function (title) {
                var CLASSNAME = ".enw__title";
                if (title !== undefined) {
                    this.title = title;
                }
                $(CLASSNAME).html(titleTpl(this.title));
                return this.title;
            },
            /**
             * @name module:defaultView#afterRender
             * @description Generally is used once for event bindings and similar things,
             * so this method might be removed right after the call
             * @function
             */
            afterRender: function () {
            },

            /**
             * @name module:defaultView#setProgressIndicator
             * @description Widget background ajax-loader.gif toggle
             * @param [status] {Number} Widget status code or this.status if undefined
             * @function
             * @returns {number} View status code
             */
            setIndicator: function (status) {
                var CLASSNAME = "enw__widget--complete",
                    state = (status || this.status) === 2;
                this.$el.toggleClass(CLASSNAME, state);

                return state;
            },

            /**
             * @name module:defaultView#update
             * @description Model data updater
             * @function
             */
            update: function () {
                this.fetch();
            },
            /**
             * @name module:defaultView#fetch
             * @description The simplest model fetch
             * @function
             */
            fetch: function (url) {

                var data = utils.getFromCache(url);

                /* istanbul ignore else */
                if (this.model) {
                    // Silent to prevent double onChange firing
                    this.model.clear({silent: true});
                    if (url) {
                        this.model.instanceUrl = url;
                    }

                    // If cached data is available, just reset the model state
                    if (data) {
                        this.model.set(data);

                    // If not, make a new one request
                    } else {

                        this.setStatus(1);
                        this.model.fetch({
                            success: $.proxy(this.successCb, this),
                            error: $.proxy(this.errorCb, this)
                        });
                    }
                }

            },
            /**
             * @name module:defaultView#successCb
             * @description success model fetch callback
             * @function
             */
            successCb: function (model, response, options) {
                /**
                 * @see module:app#setStatus
                 */
                this.setStatus(2);


                if (response.error || (response.collection && !response.collection.length)) {
                    console.warn("elasticnode.ru/widgets/#errorEmptyData");
                    this.showMsg("notFound");
                } else {
                    // Pure memoization
                    // NB: global cache scope goes here if scope isn't specified
                    /**
                     * @see module:utils#setToCache
                     */

                    utils.setToCache(model.instanceUrl, response);
                    this.switchModeDelayed();
                    return true;
                }
                return false;
            },
            /**
             * @name module:defaultView#errorCb
             * @description error model fetch callback
             * @function
             */
            errorCb: function (model, response, options) {
                // elasticnode.ru is covered behind Varnish
                // Mostly you can get this error when widget overflows throttling limit
                this.showMsg("connectionError");
                console.warn("elasticnode.ru/widgets/#errorConnectionFailure");

                this.setStatus(2);
                return true;
            },
            /**
             * @name module:defaultView#renderMenu
             * @description Renders static link list (widget mode switcher)
             * @param list {Array} Menu elements
             * @function
             * @returns {boolean} Is there a menu in view.$el
             */
            renderMenu: function (list, selector) {
                var SELECTOR = selector || ".enw__menu",
                    TPLNAME = "menuTpl",

                    $menu = this.$el.find(SELECTOR),

                // .renderMenu() method is common at least for 5 widget types,
                // so template should be cached globally
                    template = utils.getFromCache(TPLNAME) ||
                        utils.setToCache(TPLNAME, Handlebars.compile(Handlebars.partials.menu));

                // Insert rendered menu
                $menu.html(template(list));

                // Setting active class for the first item
                this.selectMenuItem($menu.children().eq(0));

                return $menu.size() > 0;
            },
            /**
             * @name module:defaultView#selectMenuItem
             * @description Menu link state indicator
             * @function
             */
            selectMenuItem: function (target, $menu) {
                var CLASSNAME = "enw__menu__link--active",
                    $target = target instanceof Object ?
                            $(target) :
                            $('*[data-href="' + target + '"]');

                switch (!!CLASSNAME) {
                case !!$target.size():
                    $target
                        .addClass(CLASSNAME)
                        .siblings()
                        .removeClass(CLASSNAME);
                    return true;
                case $menu instanceof $.fn.constructor:
                    $menu
                        .children()
                        .removeClass(CLASSNAME);
                    return true;
                default:
                    return false;
                }
            },
            /**
             * @name module:defaultView#setMode
             * @description Updates widget .mode property. It's pretty close to the validation too
             * @param arg {object|number|string} Mode object or plain arguments
             * @function
             * @returns {object|boolean} Mode object or false
             */
            setMode: function (arg) {
                // Defaults and current settings have the same keys
                var defaults = this.mode || {},
                    keys = _.keys(defaults),

                // New state may be set in array or object notation
                    argsToObj = function () {

                        var mode = {},
                            args = arguments;
                        _.each(keys, function (value, i) {
                            mode[value] = args[i];
                        });
                        return mode;
                    },
                    mode = _.pick.apply(
                        this,
                        [_.defaults(
                            typeof arg === "object" ? arg : argsToObj.apply(this, arguments),
                            defaults
                        )].concat(keys)
                    );
                if (!_.isEqual(this.mode, mode)) {
                    this.mode = mode;
                    return mode;
                }

                // If mode state wasn't changed return false to prevent useless actions
                return false;
            },
            /**
             * @name module:defaultView#switchModeDelayed
             * @description Schedules widget mode change
             * @function
             * @param arg {*} Any argument
             * @returns {boolean} Is delayed set supported
             */
            switchModeDelayed: function () {
                if (this.delayedSetModeArgs && this.delayedSetModeArgs.length && this.switchMode) {
                    this.switchMode.apply(this, this.delayedSetModeArgs);
                    this.delayedSetModeArgs = undefined;
                    return true;
                }
                return false;
            },
            /**
             * @name module:defaultView#showMsg
             * @description In-view message display. For errors, alerts, etc.
             * @param [msg] {String} Message or message code. If !msg == true the box will be hidden
             * @function
             * @returns {string|*} Message text
             */
            showMsg: function (msg) {
                var MSGBOX_SELECTOR = ".enw__msgbox",
                    CONTENT_SELECTOR = ".enw__content",
                    HIDDEN_CLASSNAME = "enw--hidden",

                    $msgbox = this.$el.find(MSGBOX_SELECTOR),
                    $content = this.$el.find(CONTENT_SELECTOR),
                    codes = {
                        "notFound": "notFoundMsg".toLocaleString(),
                        "connectionError": "connectionErrorMsg".toLocaleString()
                    };

                // If code exists
                msg = codes[msg] || msg;

                $content.toggleClass(HIDDEN_CLASSNAME, !!msg);
                $msgbox.toggleClass(HIDDEN_CLASSNAME, !msg).html(msg);

                return msg;

            },
            /**
             * @name module:defaultView#showMessage
             * @description showMsg alias
             * @function
             * @see module:defaultView#showMsg
             * @returns {string|*} Message text
             */
            showMessage: function () {
                return this.showMsg.apply(this, arguments);
            },
            /**
             * @name module:defaultView#initRelatedView
             * @description Provides internal view initialization and stores object as parent view property
             * @function
             * @returns {object|undefined} Related view instance
             */
            initRelatedView: function (hash, View, selector) {
                if (!this[hash] && View && hash && selector) {
                    var element = this.$el.find(selector).get(0);

                    /* istanbul ignore else */
                    if (element) {
                        this[hash] = new (View.extend({widget: this}))({
                            el: element
                        });
                    }
                }
                return this[hash];
            },
            /**
             * @name module:defaultView#switchRelatedView
             * @description Switches widget inner views
             * @param $target {Object} View.$el to activate
             * @function
             * @returns {object|boolean} View.$el or false
             */
            switchRelatedView: function ($target, className) {
                var CLASSNAME = className || "enw--displaynone";
                if ($target instanceof $.fn.constructor) {
                    return $target
                        .removeClass(CLASSNAME)
                        .siblings()
                        .addClass(CLASSNAME);
                }
                return false;
            }
        });
    });