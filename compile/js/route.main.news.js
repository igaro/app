module.requires = [
	{ name: 'route.main.news.css' },
	{ name: 'core.language.js' }
];

module.exports = function(app) {

   	return function(model) {

        var view = model.view, wrapper = view.wrapper;

        model.meta.set('title', {
	        en : 'News (Twitter)',
	    });

        var l = view.createAppend('div',wrapper,null,'feed');

        view.instances.add('xhr').then(
            function (xhr) {
                return xhr.get({
                    withCredentials : true,
                    headers: {
                        'Authorization' : 'Bearer 608984293-Dko9HHgDClmUhFF7aEyijO5mwySCZvDTvgh9JwwK'
                    },
                    res:'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=andrewcharnley1&count=10'
                });
            }
        ).then(
            function(data) {
				while (l.firstChild) l.removeChild(l.firstChild);
				l.innerHTML = JSON.stringify(data);
            }
        );

        var feedExec = function () {
			setInterval(feedExec, 300);
    	}

    	//feedExec();
	}
};