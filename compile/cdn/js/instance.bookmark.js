module.requires = [
    { name:'instance.bookmark.css' }
];

module.exports = function(app) {

    var bless = app['core.bless'];
    
    var opts = [
        { name:'Delicious', url:'http://del.icio.us/post?url=<URL>&title=<TITLE>' },
        { name:'Digg', url:'http://digg.com/submit?url=<URL>&title=<TITLE>' },
        { name:'Facebook', url:'http://www.facebook.com/sharer.php?u=<URL>' },
        { name:'Reddit', url:'http://reddit.com/submit?url=<URL>&title=<TITLE>' },
        { name:'StumbleUpon', url:'http://www.stumbleupon.com/submit?url=<URL>&title=<TITLE>' },
        { name:'Twitter', url:'http://twitter.com/home?status=<URL>' }
    ];

    var bookmark = function(o) {
        bless.call(this,{
            name:'instance.bookmark',
            parent:o.parent,
            asRoot:true,
            container:function(dom) { 
                return dom.mk('ul',o.container,null,'instance-bookmark');
            }
        });
        this.setURL({ 
            url:o.url? o.url : window.location.href, title:o.title 
        });
    };

    bookmark.prototype.setURL = function(o) {
        var c = this.container,
            dom = this.managers.dom;
        dom.empty(c);
        opts.forEach(function(p) {
            var to = encodeURIComponent(o.url),
                title = o.title? encodeURIComponent(obj.title) : '',
                url = p.url
                        .replace(/\<URL\>/g,to)
                        .replace(/\<TITLE\>/g,title);
            dom.mk('li',c,null, function() {
                this.className = p.name.toLowerCase();
                this.addEventListener('click', function() {
                    window.open(url);
                });
            });
        });
        return this.managers.event.dispatch('setURL',o);
    };

    return bookmark;

};
