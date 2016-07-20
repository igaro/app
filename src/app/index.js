(function(env) {

    "use strict";

	var errHandle = function(e) {

		// most likely a syntax or env error, others will be caught by loader

		// debugging googlebot and similar by way of screenshot
        document.write(e);

		// standard debug
		if (env.console)
			env.console.error(e);
	}

    try {

        // cdn logic
        @@include('conf/cdn.js');

        // helpers
        var head = document.getElementsByTagName('head')[0],
            appVerStr = "?appBuildTs="+encodeURIComponent("@@var('buildTs')")+"&appVersion="+encodeURIComponent("@@var('version')"),
            append = function(file) {
                var isCSS = file.slice(-4) === '.css',
                    s = document.createElement(isCSS? 'link' : 'script');
                s[isCSS? 'href' : 'src'] = cdn+'/'+file+appVerStr;
                if (isCSS) {
                    s.rel = "stylesheet";
				} else {
					s.async = false;
				}
                head.appendChild(s);
            };

        // main css
        append("css/app.css");

        // polyfills
        @@include('conf/polyfills.js');

        // cordova
        if (location.protocol === 'file:')
            append("cordova");

		// wait for env to ready
		window.addEventListener('load', function() {

			try {

				// initial config, including loading screen and custom load modules.
				@@include('conf/bootstrap.js');

				// loader for built in and custom modules above, usng the config file defined in bootstrap.
				@@include('builtin/exec.js');
			} catch(e) {

				errHandle(e);
			}
		});

    } catch(e) {

		errHandle(e);
    }

}).call(this,this);
