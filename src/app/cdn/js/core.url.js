//# sourceURL=core.url.js

(function(env) {

    "use strict";

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

        var url = '#!/' + this.path.join('/'),
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

        /* Gets the current location (held in hash)
         * @returns {string}
         */
        var getCurrent = function() {

            var location = env.location,
                escapedFrag = coreUrl.getSearchValue("_escaped_fragment_",location.href);

            if (escapedFrag)
                location.hash = '#!'+escapedFrag;

            return location.hash.substr(2);
        };

        // service
        var coreUrl = {

            __CoreURLMgr : CoreURLMgr,

            /* Path value from a url (or current).
             * @param {string} [url] - optional url to parse
             * @returns {Array} containing paths
             */
            getPath : function(url) {

                if (! url)
                    url = getCurrent();
                // rm hash & search & split
                return url.split('#')[0].split('?')[0].split('/').reduce(function(a,b) {

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
                // rm hash and get search
                url = url.split('#')[0].split('?')[1];
                // exists?
                if (! url)
                    return {};
                // split
                return url.split('&').reduce(function(a,b) {

                    var v = b.split('=');
                    a[decodeURIComponent(v[0])] = decodeURIComponent(v[1]) || true;
                    return a;
                }, {});
            },

            /* Returns one search param value from a url
             * @param {string} name of search key
             * @param {string} [url] - optional url to parse
             * @returns {string} search value
             */
            getSearchValue : function(name,url) {

                if (! name)
                    throw new TypeError("First argument must be defined");

                return coreUrl.getSearch(url)[name];
            },

            /* Returns the hash from a url (or current)
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

                return new CoreURLMgr(coreUrl.getPath(url),coreUrl.getSearch(url),coreUrl.getHash(url));
            },

            /* Returns manager for current url
             * @returns {CoreURLMgr}
             */
            getCurrent : function() {

                return new CoreURLMgr(coreUrl.getPath(),coreUrl.getSearch(),coreUrl.getHash());
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

        return coreUrl;
    };

})(this);
