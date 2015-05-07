__igaroapp = {
    cdn : '../../build/debug/cdn',
    libs : { 
        load :[
            { name:'conf.test.js', nosub:true, repo:'conf/', depRepoRevert:true }
        ],
    },
    init : {
        onError:function() {
           document.body.classList.add('error');

        },
        onReady: function(app) {
            document.body.classList.add('ready');
            testSuite(app);
        }
    },
    version: 0.1,
    timestamp : new Date(),
    debug : true,
    browserincompat : "Env Error",
    loaderr : "Load Err"
};

