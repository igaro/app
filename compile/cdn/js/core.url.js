//# sourceURL=core.url.js

module.exports = function() {

    "use strict";

    return {

        getParams : function(url, separator) {
            if (! url)
                url = window.location.href;
            if (! separator)
                separator = '?';
            var vars = {};
            var regexp = new RegExp("["+separator+"&]+([^=&]+)=([^&]*)", "gi");
            url.replace(regexp, function(m,key,value) {
                vars[key] = value;
            });
            return vars;
        },

        getParam : function(name,url) {
            return this.getParams(url)[name];
        },

        getHashParams : function(url) {
            return this.getParams(url,'#');
        },

        getHashParam : function(name,url) {
            var vars = this.getHashParams(url);
            return vars[name];
        },

        replaceParam : function(param,value,url) {
            if (! url)
                url = window.location.href;
            if (url.indexOf(param + "=") >= 0) {
                var prefix = url.substring(0, url.indexOf(param)),
                    suffix = url.substring(url.indexOf(param)).
                        substring(url.indexOf("=") + 1);
                suffix = (suffix.indexOf("&") >= 0) ? suffix.substring(suffix.indexOf("&")) : "";
                url = prefix + param + "=" + value + suffix;
            } else {
                url += url.indexOf("?") < 0? "?" + param + "=" + value : "&" + param + "=" + value;
            }
            return url;
        },

        getCurrent : function(o) {
            var w = document.location.protocol;
            if (o && o.ssl === false)
                w = 'http:';
            if (o && o.ssl === true)
                w = 'https:';
            w += '//'+window.location.hostname;
            if (window.location.pathname.length && o && o.path !== false)
                w += window.location.pathname;
            if (window.location.search.length && o && o.search !== false)
                w += '?'+window.location.search;
            return w;
        }

    };

};
