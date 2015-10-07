//# sourceURL=route.footer.js

(function() {

"use strict";

module.requires = [
    { name:'route.footer.css' }
];

module.exports = function(app) {

    return function(model) {

    	var wrapper = model.wrapper,
            managers = model.managers,
            domMgr = managers.dom,
            objectMgr = managers.object,
            router = app['core.router'];

        // save scroll for top button
        var saveScroll = function(event) {
            var db = document.body,
                v = db.scrollTop || document.documentElement.scrollTop;
            db.setAttribute('data-scrollPosition', v<0? 0:v);
        };
        saveScroll(0);
        window.addEventListener('scroll', saveScroll);

    	var navTop = domMgr.mk('div',null,null,'navTop');
    	navTop.addEventListener('click', function() {
    		document.body.scrollTop = document.documentElement.scrollTop = 0;
    	});
		domMgr.mk('div', model.container,
    		domMgr.mk('div', null, navTop, 'wrapper'),
    	'toTop');

		domMgr.mk('div',wrapper,[
    		domMgr.mk('span', null, _tr("License: LGPLv3"))
    	],'license');

    	domMgr.mk('div',wrapper,[
    		domMgr.mk('span', null, '© <a href="http://www.igaro.com/ppl/ac">A. Charnley</a> 2013-'+new Date().getFullYear()),
    	],'author');

        model.addSequence({ container:wrapper, promises:[

            // last update
            objectMgr.create('xhr').then(function (xhr) {
                return xhr.get({
                    silent:true,
                    res:'https://api.github.com/orgs/igaro/repos',
                }).then(
                    function(data) {
                        data = data.filter(function(x) {
                            return x.name === 'app';
                        });
                        var x = domMgr.mk('div',null,null,'lastupdate');
                        domMgr.mk('span',x, _tr("Updated:"));
                        return model.managers.object.create('date', {
                            date:data[0].updated_at,
                            format:'LLLL',
                            container: domMgr.mk('a',x,null,function() {
                                this.href = 'https://github.com/igaro/app';
                            })
                        }).then(function() {
                            return x;
                        });
                    }
                ).catch(function () { });
            }),

            // open issues
            objectMgr.create('xhr').then(function (xhr) {
                return xhr.get({
                    silent:true,
                    res:'https://api.github.com/orgs/igaro/repos',
                }).then(
                    function(data) {
                        data = data.filter(function(x) {
                            return x.name === 'app';
                        });
                        return domMgr.mk('div',null,null,function() {
                            this.className = 'openissues';
                            domMgr.mk('span',this, _tr("Open Issues:"));
                            domMgr.mk('a',this,data[0].open_issues).href='https://github.com/igaro/app/issues';
                        });
                    }
                ).catch(function () {});
            }),

            // bookmark
            objectMgr.create('bookmark', {
                url:'http://app.igaro.com',
                title:router.current.stash.title
            }).then (function(bookmark) {
                // on route change
                return domMgr.mk('div',null,bookmark.container,'bookmarks');
            })

        ] });

    };
};

})();
