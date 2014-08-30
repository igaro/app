window.addEventListener('load', function() {

    "use strict";

    var app = new Object();
    var repo = __igaroapp.cdn;
    var threads = new Array();

    // mandatory modules
    threads.push(new Array(
        { name:'core.events.js' }
    ));

    // cordova additions
    if (document.location.protocol === 'file:') {
        threads[threads.length-1].push(
            { name:'3rdparty.fastclick.js' },
            //{ name:'3rdparty.hammer.js' },
            { name:'3rdparty.cordova.css' }
        );
    }

    // 3rdparty libraries
    /* threads.push(new Array(
       { name:'3rdparty.jquery.1.js' }
       { name:'3rdparty.jquery.2.js' }
    ));
    */

    // fonts
    var b,d,e,f,g,h=document.body,a=document.createElement("div");a.innerHTML='<span style="'+["position:absolute","width:auto","font-size:128px","left:-99999px"].join(" !important;")+'">'+Array(100).join("wi")+"</span>";
    a=a.firstChild;b=function(b){a.style.fontFamily=b;h.appendChild(a);g=a.clientWidth;h.removeChild(a);return g};d=b("monospace");e=b("serif");f=b("sans-serif"); 
    var isFontAvailable=function(a){ return d!==b(a+",monospace") || f!==b(a+",sans-serif") ||e!==b(a+",serif") };
    if (! isFontAvailable('Open Sans')) {
        threads[threads.length-1].push(
            { name:'lib.fonts.opensans.css' }
        );
    }

    // further modules
    threads.push(new Array(
        // services
        { name:'service.errormanagement.js' },
        { name:'service.status.js' },
        { name:'service.consoledebug.js' },
        // conf
        { name:'conf.internalroutes.js' },
        { name:'conf.initialroutes.js' }
    ));

    var loading = document.createElement('div');
    loading.className='igaro';
        var wrapper = document.createElement('div');
        wrapper.className='wrapper';
        loading.appendChild(wrapper);
            var progress = document.createElement('div');
            progress.className='progress';
            wrapper.appendChild(progress);
                var percent = document.createElement('div');
                percent.className='percent';
                progress.appendChild(percent);
    var displayloader = setTimeout(function() {
        document.body.appendChild(loading);
    },1000);

    var onError = function(e) {
        clearTimeout(displayloader);
		progress.parentNode.removeChild(progress);
        if (! loading.parentNode) document.body.appendChild(loading);
        while (wrapper.firstChild) wrapper.removeChild(wrapper.firstChild);
        var d = document.createElement('div');
        d.className='error';
        var l;
        if ('core.language' in app) {
            l = app['core.language'].code.get();
        } else {
            l = window.navigator.userLanguage || window.navigator.language;
            l = l.substr(0,3) + l.substr(3).toUpperCase();
        }
        var t = e && e.incompatible? __igaroapp.browserincompat : __igaroapp.loaderr;
        if (! t[l]) {
            var t = l.split('-');
            if (c[t[0]]) l = c[t[0]];
            else { l = 'en'; }
        }
        d.innerHTML = t[l];
        wrapper.appendChild(d);
        if (window.console !== 'undefined' && e !== 'undefined') console.log(e);
    }

    if (typeof window.XMLHttpRequest === 'undefined') { onError({ incompatible:true, noobject:'XMLHttpRequest' }); return; }
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState !== 4) return;
        if (xhr.status !== 200 && ! (xhr.status === 0 && xhr.responseText)) { onError(xhr.status); return; }
        // passed by the loading file
        var params = {};
        window.location.search.split('&').forEach( function(o) {
            var a = o.split('=');
            params[a[0]] = a[1];
        });
        try { 
            var module={}; 
            eval(xhr.responseText); 
            app['instance.amd'] = module.exports(app,{ repo:repo, params:params });
        }
        catch (e) { 
            onError(e); 
            return; 
        }
        var percentwidth=0, loaded=0, total=threads.map(function(f){ return f.length; }).reduce(function(a,b) { return a+b });
        var raise = function() {
            if (! threads.length) return;
            var min = (loaded/total)*100;
            var max = ((loaded+1)/total)*100;
            if (percentwidth < min) {
                percentwidth = min;
            } else if (percentwidth < max) {
                percentwidth+= 0.07;
            }
            percent.style.width = percentwidth+'%';
            setTimeout(raise,25);
        }
        var amd = new app['instance.amd']({ repo:repo, onProgress: function() { loaded++; } });
        var amdl = function() {
            amd.get({ modules:threads[0] }).then(function() {
                threads.splice(0,1);
                if (! threads.length) {
                    clearTimeout(displayloader);
                    if (loading.parentNode) loading.parentNode.removeChild(loading);
                    app['core.events'].dispatch('core','ready.init',{ onError:onError })
                } else {
                    amdl();
                }
            },onError);
        }
        amdl();
        raise();
    }
    xhr.open('GET',repo+'/js/instance.amd.js',true);
    xhr.send(null);
});