Elasticnode widget
===

The easiest way to show *.elasticnode.ru content on any other site is to attach a widget.
Below's an example how to deal with it. ENW uses original SPA libraries and components with minor differences, so it's a bit heavy.

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
