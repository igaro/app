//# sourceURL=polyfill.js.1.8.5.js

if (!Object.keys) {
  Object.keys = (function () {
    'use strict';
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;
    return function (obj) {
        if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
            throw new TypeError('Object.keys called on non-object');
        }
        var result = [], prop, i;
        for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) result.push(prop);
    }
    if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
            if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i]);
        }
    }
    return result;
    };
  }());
}

if(!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

if (!Function.prototype.bind) {
    Function.prototype.bind = function() {
        var fn = this, args = Array.prototype.slice.call(arguments),
        object = args.shift();
        return function() {
            return fn.apply(object, args.concat(Array.prototype.slice.call(arguments)));
        };
    };
}
