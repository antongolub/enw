/*global require, define, console, $ */
/*jslint nomen: true, debug: true */

/**
 * @module examsAvgYearView
 * @extends module:tableView
 */


define([
    "views/tableView",
    "underscore",
    "text!templates/exams/examsTableTpl.hbs",
    "text!templates/exams/examsRowTpl.hbs"
],
    function (tableView, _, examsTableTpl, examsRowTpl) {
        "use strict";

        return tableView.extend({
            template: examsTableTpl,
            rowTemplate: examsRowTpl,
            /**
             * @name module:examsAvgYearView#renderRow
             * @description Renders table row
             * @param exam {object} Exam data
             * @param year {number} Year as xxxx
             * @returns {string} HTML-string
             * @function
             */
            renderRow: function (exam, year) {
                return this.rowTemplate({
                    type:       exam.type,
                    name:       exam.name,
                    fullName:   String(exam.name).toLocaleString(),
                    year:       year,
                    part:       exam.gtotal ? (100 * exam.total / exam.gtotal).toPrecision(3) : "",
                    threshold:  exam.threshold,
                    minimum:    exam.minimum,
                    maximum:    exam.maximum,
                    limit:      exam.limit,
                    belowThreshold:  exam.belowThreshold ? (100 * exam.belowThreshold / exam.total).toPrecision(3) : "—",
                    excellent:  (100 * exam.excellent / exam.total).toPrecision(3),
                    average:    exam.average,
                    averageCity:    exam.averageCity,
                    averageRegion:  exam.averageRegion,
                    averageCountry: exam.averageCountry
                });
            },
            /**
             * @name module:examsAvgYearView#afterRender
             * @description Sort init and event bindings
             * @see module:tableView#afterRender
             * @function
             */
            afterRender: function () {
                var LINK_SELECTOR = ".enw__link";

                this.$el.on(
                    "click",
                    LINK_SELECTOR,
                    $.proxy(this.onSubjectLinkClick, this)
                );
                this.initSortable();
            },
            /**
             * @name module:examsAvgYearView#onSubjectLinkClick
             * @description Subject click handler
             * @param e {object} Event object
             * @function
             */
            onSubjectLinkClick: function (e) {
                var $target,
                    subject,
                    year;
                /* istanbul ignore else */
                if (e && this.widget.status === 2 && this.widget.switchMode) {
                    $target = $(e.target);
                    subject = $target.data("subject");
                    year = $target.data("year");

                    this.widget.switchMode(subject, year);
                }
                return subject;
            },
            /**
             * @name module:examsAvgYearView#update
             * @description Updates table by new data
             * @function
             * @param [data] {object} Collection data
             * @param [year] {number} Year in xxxx format
             * @returns {object|undefined} Data object or undefined
             */
            update: function (data, year) {
                if (data && year) {
                    var html                = "",
                        avgExam             = 0,
                        avgMathRus          = 0,
                        avgCounter          = 0,
                        avgMathRusCounter   = 0,
                        view                = this,
                        TBODY_SELECTOR      = ".enw__table__tbody",
                        EXAM_AVG_SELECTOR   = ".examAvg",
                        EXAM_AVG_MATHRUS_SELECTOR = ".examAvgMathRus";

                    _.each(_.sortBy(data, function (item) {return String(item.name).toLocaleString(); }), function (exam) {
                        avgExam += exam.total * exam.average;
                        avgCounter += exam.total;

                        /* istanbul ignore else */
                        if (exam.name === "math" || exam.name === "russian") {
                            avgMathRus += exam.total * exam.average;
                            avgMathRusCounter += exam.total;
                        }
                        html += view.renderRow(exam, year);
                    });
                    this.$el.find(TBODY_SELECTOR).html(html);

                    // Show averages
                    this.$el.find(EXAM_AVG_SELECTOR).html(avgExam ? (avgExam / avgCounter).toPrecision(3) : "—");
                    this.$el.find(EXAM_AVG_MATHRUS_SELECTOR).html(avgMathRus ? (avgMathRus / avgMathRusCounter).toPrecision(3) : "—");

                }
                return data;
            }
        });
    });
