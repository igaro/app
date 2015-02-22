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
		bless.call(this,{
            name:'instance.oauth2',
            parent:o.parent,
            asRoot:true
        });
		this.inProgress = false;
		if (o) 
            setBits.call(this,o);
        var dom = this.managers.dom,
        	container = this.container = dom.mk('div',null,null,'instance-oauth2'),
        	self = this;
		this.win = dom.mk('iframe',container);
		window.addEventListener('message', function(event) {
            self._resolve({ token:url.getHashParam(self.tokenName,event.data) });
        });
        dom.mk('a',container,null,function() {
        	this.addEventListener('click',function(event) {
        		event.preventDefault();
        		self._resolve({ cancel:true });
        	});
        });
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
				var p = self.container.parentNode;
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