(function() {

"use strict";

module.requires = [
    { name:'route.footer.css' }
];

module.exports = function(app) {

    return function(model) {

    	var wrapper = model.wrapper,
            dom = model.managers.dom;

    	var navTop = dom.mk('div',null,null,'navTop');
    	navTop.addEventListener('click', function() {
    		document.body.scrollTop = document.documentElement.scrollTop = 0;
    	});
		dom.mk('div', model.container,
    		dom.mk('div', null, navTop, 'wrapper'),
    	'toTop');

		dom.mk('div',wrapper,[
    		dom.mk('span', null, {
    			en : 'License: GNUv2',
    			fr : 'Licence: GNUv2'
    		}),
    	],'license');

    	dom.mk('div',wrapper,[
    		dom.mk('span', null, '© <a href="http://www.andrewcharnley.com">A. Charnley</a> 2013-'+new Date().getFullYear()),
    	],'author');

        model.addSequence({ container:wrapper, promises:[

            // last update
            new Promise(function(resolve) {
                model.addInstance('xhr').then(function (xhr) {
                    xhr.get({ res:'https://api.github.com/orgs/igaro/repos' }).then(
                        function(data) {
                            data = data.filter(function(x) {
                                return x.name === 'app';
                            });
                            var x = dom.mk('div',null,null,'lastupdate');
                            dom.mk('span',x, {
                                en : 'Updated:',
                                fr : 'Mise à jour:'
                            });
                            var a = dom.mk('a',x);
                            a.href = 'https://github.com/igaro/app';
                            model.addInstance('date', {
                                date:data[0].updated_at,
                                format:'LLLL',
                                container:a
                            }).then(function() {
                            	resolve({ container:x });	
                            });
                        },
                        resolve
                    );
                });
            }),

            // open issues
            new Promise(function(resolve) {
                model.addInstance('xhr').then(function (xhr) {
                    xhr.get({ res:'https://api.github.com/orgs/igaro/repos' }).then(
                        function(data) {
                            data = data.filter(function(x) {
                                return x.name === 'app';
                            });
                            var x = dom.mk('div',null,null,'openissues');
                            dom.mk('span',x, {
                                en : 'Open Issues:',
                                fr : 'Questions en Suspens:'
                            });
                            dom.mk('a',x,data[0].open_issues).href='https://github.com/igaro/app/issues';
                            resolve({ container:x });
                        },
                        resolve
                    );
                });
            }),

            // bookmark
            model.addInstance('bookmark', { url:'http://app.igaro.com' }).then (function(bookmark) {
                return { 
                    container: dom.mk('div',null,bookmark.container, 'bookmarks') 
                };
            })
            
        ] });

    };
};

})();