/*globals require*/
"use strict";

var gulp =  require('gulp'),
    replace = require('gulp-replace'),
    path = require('path'),
    CLIENT_APP_PATH = path.resolve(__dirname, '../../client/dist/js/app'),
    fs = require('fs');

gulp.task('replace', function(){
    gulp.src([
        CLIENT_APP_PATH + "/main.js",
        CLIENT_APP_PATH + "/main-cdn.js",
        CLIENT_APP_PATH + "/main-singlefile.js"
    ])
        .pipe(replace(/"main",/g, ''))
        .pipe(gulp.dest(CLIENT_APP_PATH));
});

gulp.task('default', ['replace']);