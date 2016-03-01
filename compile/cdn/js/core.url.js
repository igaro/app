//# sourceURL=core.url.js

(function(env) {

    "use strict";

    /* Gets the current location (held in hash)
     * @returns {string}
     */
    var getCurrent = function() {

        return env.location.hash.substr(1);
    };

    /* Holds a url
     * @constructor
     */
    var CoreURLMgr = function(path,search,hash) {

        if (! (path instanceof Array))
            throw new TypeError("First argument must be of instance of Array");

        if (search && typeof search !== 'object')
            throw new TypeError("Second argument must be of type object");

        this.path = path;
        this.search = search;
        this.hash = hash;
    };

    /* Makes a string from URL components
     * @returns {string}
     */
    CoreURLMgr.prototype.toString = function() {

        var url = '#/' + this.path.join('/'),
            hash = this.hash,
            search = this.search;

        if (search) {
            url += '?' + Object.keys(search).map(function(pair) {

                return encodeURIComponent(pair[0])+'='+encodeURIComponent(pair[1]);
            }).join('&');
        }

        if (hash)
            url += '#'+hash;

        return url;
    };

    module.exports = function() {

        // service
        return {

            __CoreURLMgr : CoreURLMgr,

            /* Path value from a url (or current).
             * @param {string} [url] - optional url to parse
             * @returns {Array} containing paths
             */
            getPath : function(url) {

                if (! url)
                    url = getCurrent();
                return url.split('?')[0].split('/').reduce(function(a,b) {

                    if (b.length)
                        a.push(b);
                    return a;
                },[]);
            },

            /* Search values from a url (or current). That is, anything after ?
             * @param {string} [url] - optional url to parse
             * @returns {object} literal of values
             */
            getSearch : function(url) {

                if (! url)
                    url = getCurrent();
                var vars = {};
                var regexp = new RegExp("[?&]+([^=&]+)=([^&]*)", "gi");
                url.replace(regexp, function(m,key,value) {
                    vars[key] = value;
                });
                return vars;
            },

            /* Returns one search param value from a url
             * @param {string} name of search key
             * @param {string} [url] - optional url to parse
             * @returns {string} search value
             */
            getSearchValue : function(name,url) {

                if (! name)
                    throw new TypeError("First argument must be defined");

                return this.getSearch(url)[name];
            },

            /* Returns the hash from a url (or currrent)
             * @param {string} [url] - optional url to parse
             * @returns {string} hash value
             */
            getHash : function(url) {

                if (! url)
                    url = getCurrent();
                return  url.split('#')[1];
            },

            /* Returns manager for a url
             * @param {string} url - to use;
             * @returns {CoreURLMgr}
             */
            fromUrl : function(url) {

                if (typeof url !== 'string')
                    throw new TypeError("First argument must be of type string.");

                return new CoreURLMgr(this.getPath(url),this.getSearch(url),this.getHash(url));
            },

            /* Returns manager for current url
             * @returns {CoreURLMgr}
             */
            getCurrent : function() {

                return new CoreURLMgr(this.getPath(),this.getSearch(),this.getHash());
            },

            /* Makes a manager from components
             * @param {Array} [path] - url path
             * @param {object} [search] - url search
             * @param {string} [hash] - url hash
             * @returns {CoreURLMgr}
             */
            fromComponents : function(path,search,hash) {

                return new CoreURLMgr(path,search,hash);
            }

        };
    };

})(this);
