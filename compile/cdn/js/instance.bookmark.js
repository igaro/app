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

    var bookmark = function(o) {
        this.name='instance.bookmark';
        this.asRoot=true;
        this.container = function(dom) {
            return dom.mk('ul',o,null,o.className);
        };
        bless.call(this,o);
    };

    bookmark.prototype.init = function(o) {
        this.setURL({
            url:o.url? o.url : window.location.href, title:o.title
        });
        return this.managers.event.dispatch('init');
    };

    bookmark.prototype.setURL = function(o) {
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

    return bookmark;

};
