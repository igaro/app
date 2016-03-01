rootEmitter.on('instance.xhr.error', function (o) {

    var x = o.x,
        xhr = x.xhr;
    if (x.expectedContentType) {
        var c = xhr.getResponseHeader("Content-Type");
        if (c && c.indexOf('/'+x.expectedContentType) === -1) {
            new Toast({
                message:_tr("Invalid Response")
            });
            return;
        }
    }
    new Toast({
        message:x.connectionFailure? _tr("Connection Failure") : httpCodeTextMap[xhr.status] || _tr("Unrecogonized Response")
    });
});
