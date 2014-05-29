/*jslint nomen: true, debug: true, bitwise: true, node: true, todo: true */
/*global module, require, define, __dirname, console */

"use strict";

var feathers = require('feathers');
var path = require('path');
var app = feathers();


var STATICPATH = path.resolve(__dirname, '../../client/src'),
    BOWERPATH = path.resolve(__dirname, '../../client/src/bower_components'),
    CSSPATH = path.resolve(__dirname, '../../client/src/sass'),
    PORT = process.env.NODE_PORT || process.env.PORT || process.env.port || 8033;


// Production mode serves optimized (compressed and uglified) js-files at the client-side
app.configure('production', function () {
    STATICPATH = path.resolve(__dirname, '../../client/dist');
    console.warn("Production mode");
});


// Almost as in previous case, but original main.js file is being replaced with CDN-based version
app.configure('cdn', function () {
    STATICPATH = path.resolve(__dirname, '../../client/dist');
    app.get("/js/app/main.js", function (req, res) {
        res.sendfile(STATICPATH + "/js/app/main-cdn.js");
    });
    console.warn("CDN mode");
});


// Singlefile mode also switches STATICPATH to dist location, 
// but sends main-singlefile.js instead of original
app.configure('singlefile', function () {
    STATICPATH = path.resolve(__dirname, '../../client/dist');
    app.get("/js/app/main.js", function (req, res) {
        res.sendfile(STATICPATH + "/js/app/main-singlefile.js");
    });
    console.warn("Singlefile mode");
});


app.use("/css", feathers['static'](CSSPATH));
app.use("/bower_components", feathers['static'](BOWERPATH));
app.use(feathers['static'](STATICPATH));


// Run!
app.listen(PORT);
console.warn("on air at port " + PORT);