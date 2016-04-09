rootEmitter.on('instance.xhr.error', function (o) {

    var x = o.x,
        xhr = x.xhr;
    if (x.expectedContentType) {
        var c = xhr.getResponseHeader("Content-Type");
        if (c && c.indexOf('/'+x.expectedContentType) === -1) {
            new Toast({
                message:function(l) { return l.gettext("Invalid Response"); }
            });
            return;
        }
    }
    new Toast({
        message:x.connectionFailure
            ? function(l) { return l.gettext("Connection Failure"); }
            : httpCodeTextMap[xhr.status] || function(l) { return l.gettext("Unrecogonized Response"); }
    });
});
