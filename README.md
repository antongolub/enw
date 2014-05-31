#Elasticnode widget
[![Build Status](https://travis-ci.org/antongolub/enw.svg?branch=master)](https://travis-ci.org/antongolub/enw) [![Coverage Status](https://img.shields.io/coveralls/antongolub/enw.svg)](https://coveralls.io/r/antongolub/enw?branch=master) [![Dependency Status](https://david-dm.org/antongolub/enw.svg)](https://david-dm.org/antongolub/enw)
===


The easiest way to show *.elasticnode.ru content on any other site is to attach a widget.
Below's an example how to deal with it. ENW uses original SPA libraries and components with minor differences, so it's a bit heavy.

[Demo](http://elasticnode.ru/widget/), [Jsfiddle](http://jsfiddle.net/VmsGL/)

===

* Clone from git

* Install bower components ```project/client/src> bower install```

* Install node modules ```project/server> npm i``` (istanbul and karma need to be installed with -g flag)

* Run http-server ```project> node server/src/init.js```

* Enjoy [http://localhost:8033](http://localhost:8033)


Also you might:

Run tests ```project/client> karma start karma.conf.js```

Update docs ```project/client/docs> sh buildDocs.sh``` or
```
project/client> jsdoc src/js -r -c jsdoc.conf.json -d docs/jsdoc
project/client> docco src/js/app/*.js src/js/app/**/*.js -o docs/docco
```

Build project with r.js
```
project/client/src> ../../server/node_modules/requirejs/bin/r.js -o build.js
project/client/src> ../../server/node_modules/requirejs/bin/r.js -o build-cdn.js
project/client/src> ../../server/node_modules/requirejs/bin/r.js -o build-singlefile.js
```
### Documentation
[Service description](http://elasticnode.ru/widget/) (ru), [API documentation](http://school.elasticnode.ru/api/) (ru), [jsdoc](http://elasticnode.ru/widget/docs/jsdoc/), [docco](http://elasticnode.ru/widget/docs/docco/app.html)
### Test reports
[coverage](http://elasticnode.ru/widget/docs/coverage/Chrome%2036.0.1985%20(Mac%20OS%20X%2010.9.3)/), [unittest](http://elasticnode.ru/widget/docs/unit_reports/Chrome%2036.0.1985%20(Mac%20OS%20X%2010.9.3)/)
### r.js builds
[compressed](https://raw.githubusercontent.com/antongolub/enw/master/client/dist/js/app/main.js), [cdn-based](https://raw.githubusercontent.com/antongolub/enw/master/client/dist/js/app/main-cdn.js), [singlefile](https://raw.githubusercontent.com/antongolub/enw/master/client/dist/js/app/main-singlefile.js)
