/*global require, define, console, setTimeout */
/*jslint nomen: true, debug: true */

/**
 * @module chartView
 */

define([
    "backbone",
    "framework",
    "highcharts",
    "underscore"
],
    function (Backbone, $, Highcharts, _) {
        "use strict";
        /**
         * @name module:chartView
         * @description Highcharts-extended Backbone.View
         * @class Backbone.View
         * @requires Backbone
         * @requires framework
         * @requires Highcharts
         * @constructor
         * @returns {Function} Backbone.View constructor
         */

        var FONTCOLOR =         "#000",
            BGCOLOR =           "#FFF",
            LEGENDBORDERCOLOR = "#FFF",
            AXISCOLOR =         "#777",
            GRIDLINECOLOR =     "#EEE",
            ENW_WIDGET_CLASS =  ".enw__widget";


        return Backbone.View.extend({
            /**
             * @name module:chartView#type
             * @description Chart type identifier
             * @type {string}
             */
            type: "spline",
            /**
             * @name module:chartView#redraw
             * @description Delayed chart redraw
             * @function
             * @param delay {number} delay in ms
             * @returns {Object} widget view
             */
            redraw: function (delay) {
                /* istanbul ignore else */
                if (this.chart) {
                    var view = this;
                    setTimeout(function () {
                        view.chart.redraw();
                    }, parseInt(delay, 10) || 50);
                }
            },
            initialize: function () {
                this.self = this;
            },
            /**
             * @name module:chartView#getWidget
             * @description Returns widget view link
             * @function
             * @returns {Object} widget view
             */
            getWidget: function () {
                return this.widget;
            },
            /**
             * @name module:chartView#create
             * @description Creates a new highcharts instance
             * @param [node] {String|jQuery|DOM_Element} Node selector or this.$el if undefined
             * @param [type] {String} Chart type or "spline" if undefined
             * @param [options] {Object} Additional options
             * @function
             * @returns {Object} Highcharts instance
             */
            create: function (node, type, options) {
                if (!this.chart) {
                    node = $(node || this.$el);
                    /* istanbul ignore else */
                    if (node) {
                        options = $.extend(
                            true,
                            {
                                getWidget: $.proxy(this.getWidget, this),
                                chart: {

                                    renderTo: node.get(0),
                                    width: node.closest(ENW_WIDGET_CLASS).width()
                                }
                            },
                            this.chartOptions.defaults,
                            this.chartOptions[type || this.type],
                            this.options,
                            options
                        );
                        this.chart = new Highcharts.Chart(options);
                        return this.chart;
                    }
                }
                return null;

            },
            /**
             * @name module:chartView#flush
             * @description Destroys this.chart instance. View instance is still available
             * @function
             * @returns {null} null
             */
            flush: function () {
                this.chart = null;
                return null;
            },
            /**
             * @name module:chartView#render
             * @description Render template and append to DOM.
             * .render() also triggers this.update()
             * @function
             * @returns view {object} current view instance
             */
            render: function (data) {
                this.create();
                this.update.apply(this, arguments);
                return this;
            },
            /**
             * @name module:chartView#update
             * @description Updates chart state by new data
             * @function
             * @returns {boolean} true
             */
            update: function () {
                return true;
            },
            /**
             * @name module:chartView#updateSeries
             * @description Sets data to chart.series specified by index
             * @param data {Array}
             * @param index {Number}
             * @function
             * @returns series {Object|Null} updated series or null
             */
            updateSeries: function (data, index) {
                var k,
                    series = this.chart.series[index || 0];

                if (series) {
                    if (series.data && series.data.length) {
                        for (k = 0; k < data.length; k += 1) {
                            series.data[k].update(data[k], false);
                        }
                    } else {
                        series.update({data: data});
                    }
                    return series;
                }
                return null;
            },
            /**
             * @name module:chartView#updateCol
             * @description Updates column type chart
             * @param arg {*} Data arguments
             * @function
             * @returns series {Object|Null} updated series or null
             */
            updateCol: function () {
                return _.map(arguments, $.proxy(this.updateSeries, this));
            },
            /**
             * @name module:chartView#updatePie
             * @description Updates pie type chart
             * @param arg {*} Data arguments
             * @function
             * @returns series {Object|Null} updated series or null
             */
            updatePie: function () {
                return _.map(arguments, $.proxy(this.updateSeries, this));
            },
            /**
             * @name module:chartView#updateSpline
             * @description Updates spline type chart
             * @param arg {*} Data arguments
             * @function
             * @returns series {Object|Null} updated series or null
             */
            updateSpline: function () {
                var view = this,
                    l = arguments.length,
                    i = l,
                    c = this.chart.series.length;


                if (c > l) {
                    i = c;
                    while (l < i) {


                        this.chart.series[i - 1].remove(false);
                        i -= 1;

                    }
                } else {
                    while (c < i) {
                        i -= 1;
                        this.chart.addSeries({}, false);
                    }
                }

                return _.map(arguments, function (i, j) {
                    var series = view.chart.series[j];
                    series.update(i.data ? i : {data: i}, false);
                    return series;
                });
            },
            /**
             * @name module:chartView#chartOptions
             * @description Chart options extensions
             * @property
             * @type {object}
             */
            chartOptions: {
                defaults: {
                    chart: {
                        backgroundColor: BGCOLOR
                    },
                    credits: { enabled: false },
                    legend: {
                        borderColor: LEGENDBORDERCOLOR,
                        itemStyle: {
                            fontWeight: "normal"
                        }
                    },
                    title: {
                        text: '',
                        style: {
                            color: FONTCOLOR,
                            fontSize: 'normal'
                        }
                    }
                },
                column: {
                    colors: ['#0d233a', '#d4d8e7'], //d4d7e9
                    chart: {
                        type: 'column',
                        height: 300
                    },
                    credits: { enabled: false },
                    legend: { borderColor: '#FFF' },
                    title: {
                        text: "",
                        style: {
                            color: '#000'
                        }
                    },
                    yAxis: {
                        title: {
                            text: 'Показатель, %',
                            style: {
                                color: '#777',
                                fontWeight: 'normal'
                            }
                        },
                        gridLineColor: '#EEE'
                    },
                    xAxis: {
                        title: {
                            text: 'Параллель',
                            style: {
                                color: '#777',
                                fontWeight: 'normal'
                            }
                        }
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0,
                            borderWidth: 0,
                            animation: true
                        }
                    },
                    tooltip: {
                        enabled: true,
                        formatter: function () {
                            return '<b>' + this.series.chart.options.series[this.series._i].name +
                                ('-' + this.x).toLowerCase() + '</b><br/>' +
                                this.y.toPrecision(3) + '%';
                        }
                    }
                },
                spline: {
                    chart: {
                        type: 'spline'
                    },
                    xAxis: {
                        type: 'linear',
                        categories: []
                    },
                    yAxis: {
                        title: {
                            text: '%',
                            style: {
                                color: AXISCOLOR,
                                fontWeight: 'normal'
                            }
                        },
                        gridLineColor: GRIDLINECOLOR
                    },
                    tooltip: {
                        //enabled: false,
                        formatter: function () {
                            return '<b>' + this.series.name + '</b><br/>' +
                                this.x + ': ' + this.y.toPrecision(3);
                        }
                    },
                    plotOptions: {
                        spline: {
                            dataLabels: {
                                enabled: false
                            },
                            enableMouseTracking: true
                        },
                        series: {
                            cursor: 'pointer',
                            marker: {
                                lineWidth: 1
                            }
                        }
                    }
                },
                pie: {
                    chart: {
                        type: 'pie',
                        height: 280
                    },
                    yAxis: {
                        title: {
                            text: 'Проценты',
                            style: {
                                color: '#777',
                                fontWeight: 'normal'
                            }
                        }
                    },
                    plotOptions: {
                        pie: {
                            shadow: false,
                            center: ['50%', '50%']
                        }
                    },
                    tooltip: {
                        //enabled: false,
                        formatter: function () {
                            return '<b>' + this.point.name + '</b><br/>' +
                                this.y.toPrecision(3) + '%';
                        }
                    }
                }
            }
        });
    });