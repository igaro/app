//# sourceURL=core.url.js

(function(env) {

    "use strict";

    // has history replacestate?
    var isHTML5 = !! env.history.replaceState;

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

        var url = (isHTML5? '/' : '#!/') + this.path.join('/'),
            hash = this.hash,
            search = this.search;
        if (search) {
            var str = Object.keys(search).map(function(key) {

                return encodeURIComponent(key)+'='+encodeURIComponent(search[key]);
            }).join('&');
            if (str)
                url += '?' + str;
        }
        if (hash)
            url += '#'+hash;
        return url;
    };

    /* Gets the current url path/search/hash (html5 history api or held in hash)
     * @returns {string}
     */
    var getCurrent = function() {

        var location = env.location,
            locHash = location.hash,
            hashbangLocation = locHash.match(/\#\!(.*?)/),
            path = location.pathname,
            search = location.search,
            hash = location.hash;

        if (hashbangLocation) {
            var url = locHash.substring(2);
            path = search = hash = '';
            if (url.length) {
                var pieces = url.split('?');
                path = pieces[0];
                pieces = pieces[1];
                if (pieces) {
                    pieces = pieces.split('#');
                    search = pieces[0];
                    pieces = pieces[1];
                    if (pieces)
                        hash = pieces;
                }
            }
            if (isHTML5) {
                location.hash = hash;
                env.history.replaceState({},null,url);
            }
        }

        return {
            path : path,
            search : search,
            hash : hash
        };
    };

    module.exports = function() {

        // service
        var coreUrl = {

            __isHTML5 : isHTML5, 
            __CoreURLMgr : CoreURLMgr,

            /* Path value from a url (or current).
             * @param {string} [url] - optional url to parse
             * @returns {Array} containing paths
             */
            getPath : function(url) {

                if (! url)
                    url = getCurrent().path;
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
                    url = getCurrent().search;


                // rm hash and get search
                url = url.split('#')[0].split('?')[1];
                // exists?
                if (! url)
                    return {};
                // split
                return url.split('&').reduce(function(a,b) {

                    var v = b.split('='),
                        value = decodeURIComponent(v[1]);
                    a[decodeURIComponent(v[0])] = value? ((/[0-9]+$/).test(value)? Number(value) : value) : true;
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
                    url = getCurrent().hash;
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

            /* Returns manager for a url
             * @param {string|CoreURLMgr} url - to use;
             * @returns {undefined}
             */
            setCurrent : function(url) {
                var isCoreURLMgr = url instanceof CoreURLMgr;
                if (typeof url !== 'string' && ! isCoreURLMgr)
                    throw new TypeError("First argument must be of type string or instanceof CoreURLMgr.");

                if (isCoreURLMgr)
                    url = url.toString();

                if (isHTML5) {
                    env.history.pushState({},null,url);
                } else {
                    env.location.hash = '#!' + url;
                }
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

    // will update url if in html4 and support html5
    getCurrent();

})(this);
