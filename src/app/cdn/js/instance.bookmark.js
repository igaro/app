//# sourceURL=instance.bookmark.js

module.requires = [
    { name:'instance.bookmark.css' }
];

module.exports = function(app) {

    "use strict";

    var bless = app['core.object'].bless,
        dom = app['core.dom'];

    var opts = [
        { name:'Delicious', url:'http://del.icio.us/post?url=<URL>&title=<TITLE>' },
        { name:'Digg', url:'http://digg.com/submit?url=<URL>&title=<TITLE>' },
        { name:'Facebook', url:'http://www.facebook.com/sharer.php?u=<URL>' },
        { name:'Reddit', url:'http://reddit.com/submit?url=<URL>&title=<TITLE>' },
        { name:'StumbleUpon', url:'http://www.stumbleupon.com/submit?url=<URL>&title=<TITLE>' },
        { name:'Twitter', url:'http://twitter.com/home?status=<URL>' }
    ];

    /* Creates a bookmark helper for the current url. Not a social interactive widget!
     * @params {object} [o] - config literal
     * returns {InstanceBookmark}
     */
    var InstanceBookmark = function(o) {

        o = o || {};
        this.name='instance.bookmark';
        this.asRoot=true;
        this.container = function(dom) {

            return dom.mk('ul',o,null,o.className);
        };
        bless.call(this,o);
    };

    /* Async constructor
     * @params {object} [o] - config literal
     * returns {InstanceBookmark}
     */
    InstanceBookmark.prototype.init = function(o) {

        o = o || {};
        this.setURL({
            url:o.url? o.url : window.location.href, title:o.title
        });
        return this.managers.event.dispatch('init');
    };

    /* Set's the URL for a bookmark'r
     * @params {object} o - config containing .url, .title,
     * @returns {Promise}
     */
    InstanceBookmark.prototype.setURL = function(o) {

        var c = this.container,
            domMgr = this.managers.dom;

        dom.empty(c);
        opts.forEach(function(p) {

            var to = encodeURIComponent(o.url),
                title = o.title? encodeURIComponent(o.title) : '',
                url = p.url
                    .replace(/<URL\>/g,to)
                    .replace(/<TITLE\>/g,title);

            domMgr.mk('li',c,null,function() {

                this.className = p.name.toLowerCase();
                domMgr.mk('a',this,null,function() {

                    this.addEventListener('click', function(event) {
                        event.preventDefault();
                        window.open(url);
                    });
                    this.href = url;
                });
            });
        });

        return this.managers.event.dispatch('setURL',o);
    };

    return InstanceBookmark;

};
