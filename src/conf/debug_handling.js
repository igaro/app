// debug handling

(function() { 

    var displaying = false;
    rootEmitter.on('core.debug.handle', function (o) {

        // dont handle no connection errors
        var isNoConnectionErr = false,
            x = o.value;
        while (typeof x === 'object') {
            if (typeof x.x === 'object' && x.x.name === 'instance.xhr' && x.error === 0) {
                isNoConnectionErr = true;
                break;
            }
            x = x.error;
        }
        if (isNoConnectionErr)
            return { stopImmediatePropagation:true };

        // continue handling
        var value = typeof o === 'object' && typeof o.value === 'object'? o.value : {},
            error = value.error;

        // already handling an error?
        if (displaying)
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
                env.alert("A fatal error occured.");
            } catch(eX) {
                env.alert(eX);
            }
            displaying = false;
        }
        return debug.log(o.value,o.path,o.event);
    });
})();

