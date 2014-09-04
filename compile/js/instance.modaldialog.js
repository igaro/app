module.requires = [
    { name:'instance.modaldialog.css' },
    { name:'core.language.js' }
];

module.exports = function(app) {

    var l = {
        'alert' : {
            en : ['Ok'],
            fr : ['Okfraz']
        },
        'confirm' : {
            en : ['Confirm','Cancel'],
            fr : ['Confirmfras','Ccccc']
        },
        'input' : {
            en : ['Ok','Cancel'],
            fr : ['Ok','Cancel'],
        }
    },

    ho = 99999999,
    language = app['core.language'],
    events = app['core.events'],
    x = function() {
        var c = this.container = document.createElement('div');
        c.className = 'instance-modaldialog';
        ho+=1;
        c.style.zIndex = ho;
        document.body.appendChild(c);
        this.bodyOverflowPrevious = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        var w = document.createElement('div');
        w.className = 'wrapper';
        c.appendChild(w);
        var w2 = document.createElement('div');
        w2.className = 'wrapper';
        w.appendChild(w2);
    };

    x.prototype.alert = function(o) {

        var c = this.container,
            w = c.firstChild.firstChild,
            self = this;

        return new Promise(function(resolve) {
            var t = document.createElement('div');
            t.className = 'alert';
            w.appendChild(t);
            var m = document.createElement('div');
            m.className = 'message';
            t.appendChild(m);
            var a = document.createElement('div');
            a.className = 'action';
            t.appendChild(a);
            var ok = document.createElement('input');
            ok.type = 'submit';
            a.appendChild(ok);
            var f = function() {
                m.innerHTML = language.mapKey(o.message);
                ok.value = language.mapKey(l['alert'])[0];
            };
            f();
            events.on('core.language','code.set', f);
            ok.addEventListener('click', function() {
                c.parentNode.removeChild(c);
                document.body.style.overflow = self.bodyOverflowPrevious;
                while (w.firstChild) w.removeChild(w.firstChild);
                events.remove(f,'core.language','code.set');
                resolve();
            });
            ok.focus();
        });
    }
    
    x.prototype.confirm = function(o) {

        var c = this.container;
        var w = c.firstChild.firstChild;
        var self = this;

        return new Promise(function(resolve,reject) {
            while (w.firstChild) w.removeChild(w.firstChild);
            var t = document.createElement('div');
            t.className = 'confirm';
            w.appendChild(t);
            var m = document.createElement('p');
            t.appendChild(m);
            if (o.inputs) {
                var k = document.createElement('div');
                k.className = 'inputs';
                k.appendChild(o.inputs);
                t.appendChild(k);
            }
            var a = document.createElement('div');
            a.className = 'action';
            t.appendChild(a);
            var ok = document.createElement('input');
            ok.type = 'submit';
            a.appendChild(ok);
            var cancel = document.createElement('input');
            cancel.type = 'button';
            a.appendChild(cancel);
            var f = function() {
                m.innerHTML = language.mapKey(o.message);
                ok.value = language.mapKey(l['confirm'])[0];
                cancel.value = language.mapKey(l['confirm'])[1];
            };
            f();
            events.on('core.language','code.set', f);
            var cl = function() {
                c.parentNode.removeChild(c);
                document.body.style.overflow = self.bodyOverflowPrevious;
                events.remove(f,'core.language','code.set');
                while (w.firstChild) w.removeChild(w.firstChild);
            }
            ok.addEventListener('click', function() {
                cl();
                resolve({});
            });
            cancel.addEventListener('click', function() {
                cl();
                resolve({ cancel:true });
            });
            ok.focus();
        });
    }

    return x;

};