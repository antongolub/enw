#!/bin/sh

node ../../server/node_modules/requirejs/bin/r.js -o build.js
node ../../server/node_modules/requirejs/bin/r.js -o build-cdn.js
node ../../server/node_modules/requirejs/bin/r.js -o build-singlefile.js
