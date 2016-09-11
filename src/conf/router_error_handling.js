// handle router errors
router.managers.event.on('to-error', function (o) {
    // invalid url
    if (o.uri)
        return new ModalDialog().alert({
            message: language.substitute(function() { return this.tr((({ key:"A problem with the URL was detected and loading aborted prematurely.\n\nError: %[0]" }))); },o.uri)
        });
    // get the http xhr code
    var httpCode = o;
    while (typeof httpCode === 'object' && httpCode.error) {
      httpCode = httpCode.error;
    }
    if (httpCode === 404) {
        if (env.navigator && /bot|googlebot|crawler|spider|robot|crawling/.test(env.navigator.userAgent)) {
            window.location.href = '/404';
            return;
        }
        return new ModalDialog().alert({
            message: function() { return this.tr((({ key:"The page you requested does not exist." }))); }
        });
    }
    // else handle
    return router.managers.debug.handle(o);
});

