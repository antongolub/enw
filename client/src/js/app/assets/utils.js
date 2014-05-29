/*jslint nomen: true */
/*globals require, define, $, Env, window, navigator, console*/


/**
 * @module utils
 */

define(["framework", "underscore"],
    function ($, _) {
        "use strict";
        return {
            /**
             * @name module:utils#strictBool
             * @description Returns strict boolean value or default or false
             * @param [param] {*} Param value
             * @param [def] {Boolean} Default value or false
             * @function
             * @returns {boolean}
             */
            strictBool: function (param, def) {
                return typeof param === "boolean" ? param : !!def;
            },
            /**
             * @name module:utils#isx64
             * @description Detects x64
             * @function
             * @returns {boolean}
             */
            isx64: function () {
                /* istanbul ignore next */
                return window.navigator.platform === "MacIntel" ||
                        window.navigator.platform === "Linux x86_64" ||
                        navigator.userAgent.indexOf('WOW64') > -1 ||
                        window.navigator.platform === 'Win64' ||
                        false;
            },
            /**
             * @name module:utils#sortBy
             * @description _.sortBy extension for Handlebars Helpers
             * @function
             * @param list {Array} Array of anything
             * @param [param] {Function|String} Fn or static method name as iterator
             * @param [attr] {String} Object attr name for iterator
             * @param [withExceptions] {Boolean} Enables sorter injection
             * @returns {Array|*} Sorted array or list param as is
             *
             * @example Handlebars: {{#sortBy this 'toLocaleString' null true}}
             */
            sortBy: function (list, param, attr, withExceptions) {
                if (typeof list === "object" && !!param) {

                    // Fn definition
                    var fn = typeof param === "string" ?
                            function (item) {
                                return typeof item[param] === "function" ?
                                        item[param]() :
                                        item[param] || item;
                            } :
                            // Iterate through attribute
                            typeof attr === "string" ?
                                    function (item) {
                                        return item[attr];
                                    } :
                                    // Return element itself
                                    function (item) {
                                        return item;
                                    },
                        // A sorting hack, which allows to set "avg" as first array element for all l10ns
                        inj = function (item) {
                            var str = fn(item),
                                exceptions = [
                                    "avg".toLocaleString(),
                                    "yearSlice".toLocaleString()
                                ];

                            // Didgit is always upper
                            return _.contains(exceptions, str) ? "00" + str : str;
                        },
                        wrapFn = withExceptions ? inj : fn;
                    return _.sortBy(list, wrapFn);
                }
                return list;
            },
            /**
             * @name module:utils#getCacheSize
             * @description Returns cache size (in bytes) of specified scope
             * @function
             * @param [scope] {Object} Scope instance
             * @returns {number|undefined}
             */
            getCacheSize: function (scope) {
                return this.getCacheScope(scope).cacheSize;
            },
            /**
             * @name module:utils#setCacheSize
             * @description Sets cache size (in bytes) of scope
             * @function
             * @param [size] {number} Size in bytes
             * @param [scope] {object} Scope instance or default scope
             * @param [isx64] {boolean} x64
             * @returns {number}
             */
            setCacheSize: function (size, scope, isx64) {
                var _scope = this.getCacheScope(scope),
                    mb = 1024 * 1024,
                    _size = (
                        isNaN(size) || typeof size !== 'number' ?
                                mb * (this.strictBool(isx64, this.isx64()) ? 1 : 0.25) :
                                size > 20 * mb ?
                                        20 * mb :
                                        size < 0 ?
                                                0 :
                                                size
                    );
                if (typeof _scope.cacheSize === "number") {
                    this.freeCacheSpace(_scope, _scope.cacheSize - _size);
                } else {
                    _scope.cacheRest = _size;
                }
                _scope.cacheSize = _size;
                return _size;
            },
            /**
             * @name module:utils#freeCacheSpace
             * @description Frees up memory of scope cache
             * @function
             * @param [scope] {object} Scope instance
             * @param [space] {number} Target free space
             * @returns {number}
             */
            freeCacheSpace: function (scope, space) {
                var _scope = this.getCacheScope(scope),
                    cache = this.getCache(_scope),
                    rest = _scope.cacheRest,
                    limit = _scope.cacheSize,
                    item;

                if (limit && typeof space === "number" && space > 0) {
                    if (space >= limit) {
                        this.flushCache(_scope);
                    } else {while (rest < space) {
                        item = _scope.cacheStack.shift();
                        rest += item.size;
                        delete cache[item.key];
                    } }
                    _scope.cacheRest = rest;
                }
                return rest;
            },
            /**
             * @name module:utils#getCacheScope
             * @description Returns cache scope for specified object
             * @function
             * @returns {Object} Scope
             */
            getCacheScope: function (scope) {
                // Default scope is window.Enw
                return typeof scope === "object" ? scope : this.getDefaultCacheScope();
            },
            /**
             * @name module:utils#getDefaultCacheScope
             * @description Returns default cache scope
             * @function
             * @returns {Object} Scope
             */
            getDefaultCacheScope: function () {
                if (typeof window.Enw !== "object") {
                    window.Enw = {};
                }
                return window.Enw;
            },
            /**
             * @name module:utils#getCache
             * @description Returns/creates scope cache
             * @function
             * @param [scope] {Object} Scope instance
             *
             * @returns {Object} Scope.cache object
             */
            getCache: function (scope) {
                var _scope = this.getCacheScope(scope);
                if (!_scope.cache) {
                    _scope.cache = {};
                    _scope.cacheStack = [];
                    this.setCacheSize(this.getCacheSize(_scope), _scope);
                }
                return _scope.cache;
            },
            /**
             * @name module:utils#getCacheRest
             * @description Returns free cache space in bytes
             * @function
             * @param [scope] {Object} Scope instance
             * @returns {number}
             */
            getCacheRest: function (scope) {
                var _scope = this.getCacheScope(scope);
                return _scope.cacheRest;
            },
            /**
             * @name module:utils#setToCache
             * @description Stores value to the cache
             * @function
             * @param key {String} Hash key
             * @param val {*} Hash value
             * @param [scope] {Object} Scope instance
             *
             * @returns {*} val param as is
             */
            setToCache: function (key, val, scope) {
                var _scope = this.getCacheScope(scope),
                    cache = this.getCache(scope),
                    limit = _scope.cacheSize,
                    size = this.sizeOf(val);

                this.delFromCache(key, _scope);

                if (size <= limit && !!key) {

                    if (size > _scope.cacheRest) {
                        this.freeCacheSpace(_scope, size);
                    }
                    cache[key] = val;
                    _scope.cacheStack.push({key: key, size: size});
                    _scope.cacheRest -= size;
                }
                return val;
            },
            /**
             * @name module:utils#getFromCache
             * @description Gets cached value
             * @function
             * @param key {String} Hash key
             * @param [scope] {Object} Scope instance
             *
             * @returns {*} value
             */
            getFromCache: function (key, scope) {
                /* istanbul ignore else */
                if (!!key) {
                    return this.getCache(scope)[key];
                }
            },
            /**
             * @name module:utils#delFromCache
             * @description Removes value from cache
             * @function
             * @param key {String} Hash key
             * @param [scope] {Object} Scope instance
             *
             * @returns {Undefined} Undefined
             */
            delFromCache: function (key, scope) {
                var _scope = this.getCacheScope(scope),
                    cache = this.getCache(_scope),
                    stack = _scope.cacheStack;
                if (!!key && cache[key]) {
                    delete cache[key];
                    _.each(stack, function (item, i) {
                        if (item.key === key) {
                            _scope.cacheRest += item.size;

                            stack = stack.splice(i, 1);
                            return;
                        }
                    });
                }
                return;
            },
            /**
             * @name module:utils#flushCache
             * @description Cache annihilation
             * @function
             * @param [scope] {Object} Scope instance
             *
             * @returns {Object} Empty object
             */
            flushCache: function (scope) {
                var _scope = this.getCacheScope(scope);
                delete _scope.cache;
                delete _scope.cacheRest;
                delete _scope.cacheStack;
                delete _scope.cacheSize;
                return;
            },
            /**
             * @name module:utils#replace
             * @description Smart replace
             * @function
             * @param a {String|Array} Replace in
             * @param b {*} 1st arg
             * @param c {*} 2nd arg
             *
             * @returns {String|Array} Replace output
             */
            replace: function (a, b, c) {
                // Replacement should be set strictly
                if (arguments.length > 2) {
                    if (a instanceof Array) {
                        var i;
                        // _.map is much slower
                        for (i = a.length; i; i -= 1) {
                            if (a[i - 1] === b) {
                                a[i - 1] = c;
                            }
                        }
                    } else {
                        /* istanbul ignore else */
                        if (typeof a === "string") {
                            return a.replace(b, c);
                        }
                    }
                }
                return a;

            },
            /**
             * @name module:utils#sizeOf
             * @author Stephen Morley - http://code.stephenmorley.org/
             * @licence CC0 1.0 http://creativecommons.org/publicdomain/zero/1.0/legalcode
             * @description A function to calculate the approximate memory usage of objects
             * @function
             * @param object {*} Measurable object
             * @returns {Number} Size in bytes
             */
            sizeOf: function (object) {
                // initialise the list of objects and size
                var objects = [object],
                    index,
                    size = 0,
                    processed,
                    search,
                    key;

                // loop over the objects
                for (index = 0; index < objects.length; index += 1) {

                    // determine the type of the object
                    switch (typeof objects[index]) {

                        // the object is a boolean
                    case 'boolean':
                        size += 4;
                        break;

                    // the object is a number
                    case 'number':
                        size += 8;
                        break;

                    // the object is a string
                    case 'string':
                        size += 2 * objects[index].length;
                        break;

                    // the object is a generic object
                    case 'object':
                        // if the object is not an array, add the sizes of the keys
                        /* istanbul ignore else */
                        if (Object.prototype.toString.call(objects[index]) !== '[object Array]') {
                            for (key in objects[index]) {
                                /* istanbul ignore else */
                                if (objects[index].hasOwnProperty(key)) {
                                    size += 2 * key.length;
                                }
                            }
                        }

                        // loop over the keys
                        for (key in objects[index]) {
                            /* istanbul ignore else */
                            if (objects[index].hasOwnProperty(key)) {



                                // determine whether the value has already been processed
                                processed = false;
                                for (search = 0; search < objects.length; search += 1) {
                                    if (objects[search] === objects[index][key]) {
                                        processed = true;
                                        break;
                                    }
                                }

                                // queue the value to be processed if appropriate
                                if (!processed) {
                                    objects.push(objects[index][key]);
                                }
                            }
                        }
                        break;
                    }
                }
                // return the calculated size
                return size;

            }
        };
    });