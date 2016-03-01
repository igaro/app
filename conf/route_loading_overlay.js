// route loading overlay
dom.mk('div',null,null,function() {

    var self = this,
        rME = router.managers.event,
        body = document.body,
        bodyStyle = body.style,
        ref;
    dom.mk('div',this,dom.mk('div',null,_tr("Loading...")),'progress');
    this.className = 'igaro-router-loading';
    rME.on('to-in-progress', function() {

        clearTimeout(ref);
        ref = setTimeout(function() {

            bodyStyle.overflow = 'hidden';
            body.appendChild(self);
        }, 700);
    });
    rME.on(['to-end','to-error'], function(o) {

        if (! o || o.value !== -1600) {
            clearTimeout(ref);
            if (! params.conf.noBodyStyleOverflowReset)
                bodyStyle.overflow = '';
            dom.rm(self);
        }
    });
});
