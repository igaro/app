// write page title & meta for current route and on route change (SEO)
var eF = function(element,n,model) {

    var c = model.stash[n];
    if (! c)
        return dom.rm(element);
    dom.setContent(element,c);
    dom.head.appendChild(element);
};

// title
var title = dom.head.getElementsByTagName('title')[0],
    set = function(model) {

        return eF(title,'title',model);
    };
set(router.current);
router.managers.event.on('to-in-progress', function(model) {

    return set(model);
});

// meta tags
['description','keywords'].forEach(function(n) {

    dom.mk('meta',null,null,function() {

        this.name = n;
        eF(this,n,router.current);
        var self = this;
        router.managers.event.on('to-in-progress', function(model) {

            return eF(self,n,model);
        });
    });
});
