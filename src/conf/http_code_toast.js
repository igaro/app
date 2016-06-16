rootEmitter.on('instance.xhr.error', function (o) {

    var x = o.x,
        xhr = x.xhr;

    if (x.expectedContentType) {
        var c = xhr.getResponseHeader("Content-Type");
        if (c && c.indexOf('/'+x.expectedContentType) === -1) {
            new Toast({
                message:function() { return this.tr((({ key:"Invalid Response" }))); }
            });
            return;
        }
    }
    new Toast({
        message:x.connectionFailure
            ? function() { return this.tr((({ key:"Connection Failure" }))); }
            : httpCodeTextMap[xhr.status] || function() { return this.tr((({ key:"Unrecogonized Response" }))); }
    });
});
