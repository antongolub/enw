#!/bin/sh

jsdoc ../src/js -r -c jsdoc.conf.json -d jsdoc
docco ../src/js/app/*.js ../src/js/app/**/*.js -o ./docco