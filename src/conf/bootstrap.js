var body = document.body,
    bodyStyle = body.style,
    resetOverflow = function(conf) {
        if (! conf.noBodyStyleOverflowReset)
            bodyStyle.overflow = '';
    },
    workers = [],
    loading = document.createElement('div'),
    loadingWrapper = document.createElement('div');

loadingWrapper.className = 'working';
loading.className = 'igaro-loading';
loading.appendChild(loadingWrapper);
bodyStyle.overflow = 'hidden',
body.appendChild(loading);

var appConf = {
    cdn : cdn,
    msgIncompatible : function() { return this.tr((({ key:"Your device or software is too old. Please upgrade." }))); },
    msgErr : function() { return this.tr((({ key:"An unexpected error has occurred.<p>Please email <b>app-support@igaro.com</b> for support." }))); },
    libs : {
        load :[
            { name:'conf.app.js' }
        ],
        local : [
            { name:'3rdparty.fastclick.js' },
            { name:'3rdparty.cordova.css' }
        ],
        touch : [
            { name:'3rdparty.hammer.js' }
        ],
        fonts : [
            { name:'Open Sans' }
        ]
    },
    version: "@@var('version')",
    buildTs: "@@var('buildTs')",
    timestamp : new Date(),
    debug : true,
    init : {
        onProgress : function(app,conf,v) {
            loadingWrapper.className = '';
            if (workers.length && workers.every(function (worker) {
                return worker.done;
            })) {
                loadingWrapper.className = 'workers_done';
            }
            loadingWrapper.textContent='';
            while (v) {
                v.workers.forEach(function(w) {
                    if (workers.indexOf(w) === -1)
                        workers.push(w);
                });
                v = v.children;
            }
            workers.forEach(function(w) {
                var p = document.createElement('div');
                p.className = 'worker';
                var i = document.createElement('div');
                i.className = w.done? 'done' : 'working';
                p.appendChild(i);
                loadingWrapper.appendChild(p);
            });
        },
        onReady : function(app,conf) {
            workers = null;
            setTimeout(function() {
                body.removeChild(loading);
                resetOverflow(conf);
            }, 5);
        },
        onError : function(app,conf,e) {
            loadingWrapper.className = 'error';
            resetOverflow(conf);
            e = typeof e === 'object' && e.error && e.error.incompatible? conf.msgIncompatible : conf.msgErr;
            loadingWrapper.innerHTML = Object.keys(e).map(function(n) {
               return e[n];
            }).join("<p>");
        }
    }
};


