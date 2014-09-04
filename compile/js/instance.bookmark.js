module.requires = [
    { name:'instance.bookmark.css' }
];

module.exports = function(app) {

    var opts = [
        { name:'Delicious', url:'http://del.icio.us/post?url=<URL>&title=<TITLE>' },
        { name:'Digg', url:'http://digg.com/submit?url=<URL>&title=<TITLE>' },
        { name:'Facebook', url:'http://www.facebook.com/sharer.php?u=<URL>' },
        { name:'Reddit', url:'http://reddit.com/submit?url=<URL>&title=<TITLE>' },
        { name:'StumbleUpon', url:'http://www.stumbleupon.com/submit?url=<URL>&title=<TITLE>' },
        { name:'Twitter', url:'http://twitter.com/home?status=<URL>' }
    ];

    var a = function(o) {
        var c = this.container = document.createElement('ul');
        c.className = 'instance-bookmark';
        this.setURL({ url:o.url? o.url : window.location.href, title:o.title });
        if (o.container) o.container.appendChild(c);
    }

    a.prototype.setURL = function(o) {
        var c = this.container;
        while(c.firstChild) { c.removeChild(c.firstChild) }
        opts.forEach(function(p) {
            var to = encodeURIComponent(o.url);
            var title = o.title? encodeURIComponent(obj.title) : '';
            var url = p.url;
            url = url.replace(/\<URL\>/g,to);
            url = url.replace(/\<TITLE\>/g,title);
            var li = document.createElement('li');
            li.className = p.name.toLowerCase();
            li.addEventListener('click', function() {
                window.open(url);
            });
            c.appendChild(li);
        });
    }

    return a;

};