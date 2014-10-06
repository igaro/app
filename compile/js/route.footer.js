module.requires = [
    { name:'route.footer.css' }
];

module.exports = function(app) {

    return function(model) {

    	var view = model.view, wrapper = view.wrapper;

    	var navTop = view.createAppend('div',null,null,'navTop');
    	navTop.addEventListener('click', function() {
    		document.body.scrollTop = document.documentElement.scrollTop = 0;
    	});
		view.createAppend('div', view.container,
    		view.createAppend('div', null, navTop, 'wrapper'),
    	'toTop');

		view.createAppend('div',wrapper,[
    		view.createAppend('span', null, {
    			en : 'License: GNUv2',
    			fr : 'Licence: GNUv2'
    		}),
    	],'license');

    	view.createAppend('div',wrapper,[
    		view.createAppend('span', null, {
    			en : '© <a href="http://www.andrewcharnley.com">A. Charnley</a> 2013-'+new Date().getFullYear()
    		}),
    	],'author');


        // sequence
        view.addSequence({ container:wrapper, promises:[

            // last update
            new Promise(function(resolve) {
                view.instances.add('xhr').then(function (xhr) {
                    xhr.get({ res:'https://api.github.com/orgs/igaro/repos' }).then(
                        function(data) {
                            data = data.filter(function(x) {
                                return x.name === 'app';
                            });
                            var x = view.createAppend('div',null,null,'lastupdate');
                            view.createAppend('span',x, {
                                en : 'Updated:',
                                fr : 'Mise à jour:'
                            });
                            var a = view.createAppend('a',x);
                            a.href = 'https://github.com/igaro/app';
                            view.instances.add('date', {
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
                view.instances.add('xhr').then(function (xhr) {
                    xhr.get({ res:'https://api.github.com/orgs/igaro/repos' }).then(
                        function(data) {
                            data = data.filter(function(x) {
                                return x.name === 'app';
                            });
                            var x = view.createAppend('div',null,null,'openissues');
                            view.createAppend('span',x, {
                                en : 'Open Issues:',
                                fr : 'Questions en Suspens:'
                            });
                            view.createAppend('a',x,data[0].open_issues).href='https://github.com/igaro/app/issues';
                            resolve({ container:x });
                        },
                        resolve
                    );
                });
            }),

            // bookmark
            view.instances.add('bookmark', { url:'http://app.igaro.com' }).then (function(bookmark) {
                return { container: view.createAppend('div',null,bookmark.container, 'bookmarks') };
            })
            
        ] });

    };
};