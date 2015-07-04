//# sourceURL=instance.oauth2.js

module.requires = [
    { name: 'instance.oauth2.css' },
    { name: 'core.url.js' }
];

module.exports = function(app) {

    "use strict";

    var coreUrl = app['core.url'],
 		bless = app['core.object'].bless;

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
        this.name='instance.oauth2';
        this.asRoot=true;
		var self = this;
        this.container=function(dom) {
            return dom.mk('div',null,null,function() {
                this.className = 'igaro-instance-oauth2';
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
        };
        bless.call(this,o);
		this.inProgress = false;
        setBits.call(this,o);
		var msglist = function(event) {
            var callbackUrl = self.callbackUrl,
                tokenName = self.tokenName,
                url = event.data;
            if (url.substr(0,callbackUrl.length) === callbackUrl)
                self._resolve({
                    token:coreUrl.getParam(tokenName,url) || coreUrl.getHashParam(tokenName,url),
                    url : url
                });
        };
        window.addEventListener('message',msglist);
        this.managers.event.on('destroy', function() {
            window.removeEventListener('message', msglist);
        });
	};

    InstanceOauth2.prototype.init = function() {
        return this.managers.event.dispatch('init');
    };

	InstanceOauth2.prototype.exec = function(o) {
		if (o)
            setBits.call(this,o);
		var self = this,
			body = document.body,
            container = this.container;
    	this.win.src = this.authUrl
			.replace('[CALLBACKURL]', encodeURIComponent(this.callbackUrl))
			.replace('[SCOPE]', encodeURIComponent(this.scope))
			.replace('[DEVID]', encodeURIComponent(this.devid));
    	body.appendChild(container);
    	this.inProgress = true;
		return new Promise(function(resolve) {
			self._resolve = function(o) {
				self.inProgress =  false;
                if (container.parentNode)
                    body.removeChild(container);
				resolve(o);
			};
		});
	};

	return InstanceOauth2;

};
