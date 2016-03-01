// debug handling
var displaying = false;
rootEmitter.on('core.debug.handle', function (o) {

    var value = typeof o === 'object' && typeof o.value === 'object'? o.value : {},
        error = value.error;
    if (displaying || error === 0)
        return;

    displaying = true;

    var param = params.conf,
        msg = typeof error === 'object' && error.incompatible? param.msgIncompatible : param.msgErr;

    try {
        new ModalDialog().alert({
            message: msg
        }).then(function() {

            displaying = false;
        });
    } catch (e) {
        // should never get here
        try {
            env.alert(msg.en);
        } catch(eX) {
            env.alert(eX);
        }
        displaying = false;
    }
    return debug.log(o.value,o.path,o.event);
});

