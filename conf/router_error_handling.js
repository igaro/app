// handle router errors
router.managers.event.on('to-error', function (o) {
    // invalid url
    if (o.uri)
        return new ModalDialog().alert({
            message: language.substitute(_tr("A problem with the URL was detected and loading aborted prematurely.\n\nError: %[0]"),o.uri)
        });
    // get the http xhr code
    var httpCode = o;
    while (typeof httpCode === 'object' && httpCode.error) {
      httpCode = httpCode.error;
    }
    if (httpCode === 404)
        return new ModalDialog().alert({
            message: _tr("The page you requested does not exist.")
        });
    // else handle
    return router.managers.debug.handle(o);
});

