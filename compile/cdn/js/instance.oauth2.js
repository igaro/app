(function() {

'use strict';

module.requires = [
    { name: 'instance.oauth2.css' },
    { name: 'core.url.js' },
];

module.exports = function(app) {

    var url = app['core.url'],
 		bless = app['core.bless'],
    	xhr = app['instance.xhr'];

	var setBits = function(p) {
		if (p.scope) 
			this.scope = p.scope;
		if (p.devid) 
			this.devid = p.devid;
		if (p.callbackUrl) 
			this.callbackUrl = p.callbackUrl;
		if (p.authUrl) 
			this.authUrl = p.authUrl;
		if (p.tokenName) 
			this.tokenName = p.tokenName;
		if (p.stash)
			this.stash = p.stash;
    };

	var InstanceOauth2 = function(o) {
		var self = this;
        bless.call(this,{
            name:'instance.oauth2',
            parent:o.parent,
            stash:o.stash,
            asRoot:true,
            container:function(dom) {
                return dom.mk('div',null,null,function() {
                    if (o.className)
                        this.classList.add(o.className);
                    self.win = dom.mk('iframe',this);
                    dom.mk('a',this,null,function() {
                        this.addEventListener('click',function(event) {
                            event.preventDefault();
                            self._resolve({ cancel:true });
                        });
                    });
                });
            }
        });
		this.inProgress = false;
		if (o) 
            setBits.call(this,o);
		window.addEventListener('message', function(event) {
            self._resolve({ token:url.getHashParam(self.tokenName,event.data) });
        });
	};

    InstanceOAuth2.prototype.init = function(o) {
        return this.managers.event.dispatch('init');
    };

	InstanceOauth2.prototype.exec = function(o) {
		if (o) 
            setBits.call(this,o);
		var self = this,
			body = document.body,
			win = this.win;
    	win.src = this.authUrl
			.replace('[CALLBACKURL]', encodeURIComponent(this.callbackUrl))
			.replace('[SCOPE]', encodeURIComponent(this.scope))
			.replace('[DEVID]', encodeURIComponent(this.devid));
    	body.appendChild(this.container);
    	this.inProgress = true;
		return new Promise(function(resolve) {
			self._resolve = function(o) {
				self.inProgress =  false;
				try {
					body.removeChild(self.container);
				} catch(e) {}
				resolve(o);
			};
		});
	};

	return InstanceOauth2;
	
};

})();
