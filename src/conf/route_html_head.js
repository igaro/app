// title & setter
var head = dom.head,
    title = head.getElementsByTagName('title')[0],
    // write page title & meta for current route and on route change (SEO)
    eF = function(element,n,model) {

        var c = model.stash[n];
        if (! c)
            return dom.rm(element);
        dom.setContent(element,c);
        dom.head.appendChild(element);
    },
    set = function(model) {

        head.appendChild(title);
        return eF(title,'title',model);
    };

// no title on html loader?
if (! title)
    title = document.createElement('title');

// set title of current
set(router.current);

// register handle
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
