define(["framework","underscore"],function(e,t){return{strictBool:function(e,t){return"boolean"==typeof e?e:!!t},isx64:function(){return"MacIntel"===window.navigator.platform||"Linux x86_64"===window.navigator.platform||navigator.userAgent.indexOf("WOW64")>-1||"Win64"===window.navigator.platform||!1},sum:function(c){return e.isArray(c)&&0!==c.length?t.reduce(c,function(e,t){return e+t}):0},sortBy:function(e,c,n,r){if("object"==typeof e&&c){var a="string"==typeof c?function(e){return"function"==typeof e[c]?e[c]():e[c]||e}:"string"==typeof n?function(e){return e[n]}:function(e){return e},i=function(e){var c=a(e),n=["avg".toLocaleString(),"yearSlice".toLocaleString()];return t.contains(n,c)?"00"+c:c},o=r?i:a;return t.sortBy(e,o)}return e},getCacheSize:function(e){return this.getCacheScope(e).cacheSize},setCacheSize:function(e,t,c){var n=this.getCacheScope(t),r=1048576,a=isNaN(e)||"number"!=typeof e?r*(this.strictBool(c,this.isx64())?1:.25):e>20*r?20*r:0>e?0:e;return"number"==typeof n.cacheSize?this.freeCacheSpace(n,n.cacheSize-a):n.cacheRest=a,n.cacheSize=a,a},freeCacheSpace:function(e,t){var c,n=this.getCacheScope(e),r=this.getCache(n),a=n.cacheRest,i=n.cacheSize;if(i&&"number"==typeof t&&t>0){if(t>=i)this.flushCache(n);else for(;t>a;)c=n.cacheStack.shift(),a+=c.size,delete r[c.key];n.cacheRest=a}return a},getCacheScope:function(e){return"object"==typeof e?e:this.getDefaultCacheScope()},getDefaultCacheScope:function(){return"object"!=typeof window.Enw&&(window.Enw={}),window.Enw},getCache:function(e){var t=this.getCacheScope(e);return t.cache||(t.cache={},t.cacheStack=[],this.setCacheSize(this.getCacheSize(t),t)),t.cache},getCacheRest:function(e){var t=this.getCacheScope(e);return t.cacheRest},setToCache:function(e,t,c){var n=this.getCacheScope(c),r=this.getCache(c),a=n.cacheSize,i=this.sizeOf(t);return this.delFromCache(e,n),a>=i&&e&&(i>n.cacheRest&&this.freeCacheSpace(n,i),r[e]=t,n.cacheStack.push({key:e,size:i}),n.cacheRest-=i),t},getFromCache:function(e,t){return e?this.getCache(t)[e]:void 0},delFromCache:function(e,c){var n=this.getCacheScope(c),r=this.getCache(n),a=n.cacheStack;e&&r[e]&&(delete r[e],t.each(a,function(t,c){return t.key===e?(n.cacheRest+=t.size,void(a=a.splice(c,1))):void 0}))},flushCache:function(e){var t=this.getCacheScope(e);delete t.cache,delete t.cacheRest,delete t.cacheStack,delete t.cacheSize},replace:function(e,t,c){if(arguments.length>2)if(e instanceof Array){var n;for(n=e.length;n;n-=1)e[n-1]===t&&(e[n-1]=c)}else if("string"==typeof e)return e.replace(t,c);return e},sizeOf:function(e){var t,c,n,r,a=[e],i=0;for(t=0;t<a.length;t+=1)switch(typeof a[t]){case"boolean":i+=4;break;case"number":i+=8;break;case"string":i+=2*a[t].length;break;case"object":if("[object Array]"!==Object.prototype.toString.call(a[t]))for(r in a[t])a[t].hasOwnProperty(r)&&(i+=2*r.length);for(r in a[t])if(a[t].hasOwnProperty(r)){for(c=!1,n=0;n<a.length;n+=1)if(a[n]===a[t][r]){c=!0;break}c||a.push(a[t][r])}}return i}}});