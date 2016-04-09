// capture 401 xhr errors (unauthorized) and begin oauth if for account
var replay = [];
rootEmitter.on('instance.xhr.response', function(o) {

    if (o.xhr.status !== 401 || ! o.stash || ! o.stash.account)
        return;
    replay.push(o);
    var acc = o.stash.account,
        oauth = acc.oauth2;
    // token is bad, wipe
    acc.setToken();
    // begin oauth if not in progress
    if (! oauth.inProgress) {
        oauth.exec().then(function (o) {

            var token = o.token;
            acc.setToken(token);
            replay.forEach(function(p,i) {

                var s = p.stash.account;
                if (p && ((typeof s === 'function' && acc === s()) || acc === p.stash.account)) {
                    if (token) {
                        replay[i].send();
                    } else {
                        replay[i].abort();
                    }
                    replay[i]= null;
                }
            });
        });
    }
    return {
        stopImmediatePropagation:true
    };
},{ prepend:true });

