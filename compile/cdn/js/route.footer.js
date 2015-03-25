(function() {

"use strict";

module.requires = [
    { name:'route.footer.css' }
];

module.exports = function(app) {

    return function(model) {

    	var wrapper = model.wrapper,
            domMgr = model.managers.dom;

    	var navTop = domMgr.mk('div',null,null,'navTop');
    	navTop.addEventListener('click', function() {
    		document.body.scrollTop = document.documentElement.scrollTop = 0;
    	});
		domMgr.mk('div', model.container,
    		domMgr.mk('div', null, navTop, 'wrapper'),
    	'toTop');

		domMgr.mk('div',wrapper,[
    		domMgr.mk('span', null, _tr("License: GNUv2"))
    	],'license');

    	domMgr.mk('div',wrapper,[
    		domMgr.mk('span', null, '© <a href="http://www.andrewcharnley.com">A. Charnley</a> 2013-'+new Date().getFullYear()),
    	],'author');

        model.addSequence({ container:wrapper, promises:[

            // last update
            model.managers.object.create('xhr').then(function (xhr) {
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
                ).catch(function () {});
            }),

            // open issues
            model.managers.object.create('xhr').then(function (xhr) {
                return xhr.get({
                    silent:true, 
                    res:'https://api.github.com/orgs/igaro/repos',
                }).then(
                    function(data) {
                        data = data.filter(function(x) {
                            return x.name === 'app';
                        });
                        var x = domMgr.mk('div',null,null,'openissues');
                        domMgr.mk('span',x, _tr("Open Issues:"));
                        domMgr.mk('a',x,data[0].open_issues).href='https://github.com/igaro/app/issues';
                        return x;
                    }
                ).catch(function () {});
            }),

            // bookmark
            model.managers.object.create('bookmark', { url:'http://app.igaro.com' }).then (function(bookmark) {
                return domMgr.mk('div',null,bookmark.container, 'bookmarks');
            })
            
        ] });

    };
};

})();
