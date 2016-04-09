(function(env) {

    "use strict";

    module.exports = function(app) {

        var events = app['core.events'];

        // private function to dive into an object and return its container, if it's not a Node object member already
        var pQ = function(o) {

            if (!(o instanceof HTMLElement || o instanceof DocumentFragment) && o.container)
                return o.container;
            return o;
        };

        /* Manager
         * @constructor
         * @param {object} parent - parent the dom manager belongs to
         */
        var CoreDomMgr = function(parent) {

            this.parent = parent;
        };

        /* Makes a DOM element and adds it to a particular place.
         * @param {string} t - name of dom element, i.e div
         * @param {object} [o] - dom element to append the object into. Can also be a literal containing prepend, insertBefore etc
         * @param {object|object[]} [c] - dom elements to append into the new object. Can also be objects containing a container attribute, aka Igaro blessed object.
         * @returns {Node} Dom Element
         */
        CoreDomMgr.prototype.mk = function(t,o,c,m) {

            var r = dom.mk.call(this,t,o,c,m);
            this.parent.managers.event.on('destroy', function() {

                return dom.rm(r);
            }, { deps:[r] });
            return r;
        };

        /* Destroys the object (clean up ops)
         * @returns {Promise} containing null
         */
        CoreDomMgr.prototype.destroy = function() {

            this.parent = null;
            return Promise.resolve();
        };

        // service
        var dom = {
            head : document.getElementsByTagName('head')[0],
            mk : function(t,o,c,m) {

                var r,
                    i,
                    self = this,
                    type = t.indexOf('[');
                if (type !== -1) {
                    r = document.createElement(t.substr(0,type));
                    r.type = t.slice(type+1,-1);
                } else {
                    r = document.createElement(t);
                }
                if (t === 'a')
                    r.href='';
                if (o && typeof o === 'object') {
                    if (o instanceof HTMLElement || o instanceof DocumentFragment) {
                        o.appendChild(r);
                    } else if (o.prepend) {
                        i.parentNode.insertBefore(r,i.parentNode.firstChild);
                    } else if (o.insertBefore) {
                        i = o.insertBefore;
                        if (!(i instanceof HTMLElement))
                            i = i.container;
                        i.parentNode.insertBefore(r,i);
                    } else if (o.insertAfter) {
                        i = o.insertAfter;
                        if (!(i instanceof HTMLElement))
                            i = i.container;
                        i.parentNode.insertBefore(r,i.nextSibling);
                    } else if (o.container) {
                        o.container.appendChild(r);
                    }
                }
                switch (typeof m) {
                    case 'string' :
                        r.className=m;
                        break;
                    case 'function' :
                        m.call(r);
                        break;
                }
                if (typeof c !== 'undefined' && c !== null) {
                    if (typeof c === 'function') {
                        c = c(self);
                    } else if (c instanceof Array) {
                        var d = document.createDocumentFragment();
                        c.forEach(function(k) {

                            if ((! (k instanceof Node)) && k.container)
                                k = k.container;
                            d.appendChild(k);
                        });
                        c=d;
                    }
                    if (c !== null && typeof c !== 'undefined')
                        dom.setContent(r,c);
                }
                return r;
            },

            /* Sets the placeholder attribute for a DOM element and listens to language change
             * @param {Node} r - DOM element
             * @param {object} l - language literal
             * @returns {null}
             */
            setPlaceholder : function(r,l) {

                var f = r.igaroPlaceholderFn;
                var language = app['core.language'];
                if (! language)
                    throw new Error('core.dom -> core.language is not loaded.');
                var xMgr = language.managers.event;
                if (f)
                    xMgr.remove(f,'setEnv');
                f = r.igaroPlaceholderFn = function() {

                    r.placeholder = language.mapKey(l);
                };
                xMgr.on('setEnv', f, { deps:[r] });
                f();
            },

            /* Hides a DOM element - shortcut className appender
             * @param {Node} r - DOM element
             * @param {boolean} [v] - whether to hide (default true)
             * @returns {null}
             */
            hide : function(r,v) {

                if (! (r instanceof Node))
                    throw new TypeError('No DOM element supplied');
                if (typeof v === 'boolean' && v === false)
                    return this.show(r);
                r.classList.add('core-dom-hide');
            },

            /* Detects if a DOM element is visible
             * @param {Node} r - DOM element
             * @returns {boolean}
             */
            isHidden : function(r) {

                var t = r;
                while (t.parentNode && ! t.classList.contains('core-dom-hide')) {
                    t = t.parentNode;
                }
                if (! (t instanceof HTMLDocument))
                    return true;
                var style = window.getComputedStyle(r);
                return style.visibility === 'hidden' || style.display === 'none';
            },

            /* Toggles the display of a DOM element - shortcutter sugar
             * @param {Node} r - DOM element
             * @returns {null}
             */
            toggleVisibility : function(r) {

                if (! (r instanceof Node))
                    throw new TypeError('No DOM element supplied');
                this.hide(r,! r.classList.contains('core-dom-hide'));
            },

            /* Shows a DOM element - shortcut className remover
             * @param {Node} r - DOM element
             * @returns {null}
             */
            show : function(r) {

                if (! (r instanceof Node))
                    throw new TypeError('No DOM element supplied');
                r.classList.remove('core-dom-hide');
            },

            /* Works out an objects position coordinates through the tree
             * @param {Node} r - DOM element
             * @returns {object} containing x and y values
             */
            offset : function(r) {

                if (! (r instanceof Node))
                    throw new TypeError('No DOM element supplied');
                var x = 0,
                    y = 0;
                while(r) {
                    x += (r.offsetLeft - r.scrollLeft + r.clientLeft);
                    y += (r.offsetTop - r.scrollTop + r.clientTop);
                    r = r.offsetParent;
                }
                return { x:x, y:y };
            },

            /* Appends a DOM Element into another, supporting insertAfter, insertBefore
             * @param {Node} r - DOM element to append into
             * @param {(Node|Node[])} c - DOM element(s) to append
             * @returns {object} [o] configuration to use insertAfter, insertBefore (default appendChild)
             */
            append : function(r,c,o) {

                var self = this;
                if (c instanceof Array)
                    return c.forEach(function(a) {

                        self.append(r,a,o);
                    });
                r = pQ(r);
                c = pQ(c);
                if (o && o.insertBefore) {
                    r.insertBefore(c,pQ(o.insertBefore));
                } else if (o && o.insertAfter) {
                    var insertAfter = pQ(o.insertAfter);
                    if (insertAfter.nextElementSibling) {
                        r.insertBefore(c, insertAfter.nextElementSibling);
                    } else {
                        r.appendChild(c);
                    }
                } else {
                    r.appendChild(c);
                }
            },

            /* Sets a DOM Elements content
             * @param {Node} r - DOM element to control
             * @param {(Node|string|object)} c - DOM Elements, text or a language literal
             * @param {boolean} purge - whether to clear the control, default true
             * @returns {null}
             */
            setContent : function(r,c,purge) {

                if (! purge)
                    this.purge(r,true);
                r.textContent = '';
                if (typeof c === 'object') {
                    if (c instanceof HTMLElement || c instanceof DocumentFragment) {
                        r.appendChild(c);
                    } else if (c.hasOwnProperty('container')) {
                        r.appendChild(c.container);
                    } else {
                        var language = app['core.language'];
                        if (! language)
                            throw new Error('core.dom -> core.language is not loaded.');
                        var xMgr = language.managers.event,
                            lf = r.igaroLangFn;
                        if (lf) {
                            xMgr.remove(lf,'setEnv');
                            delete r.igaroLangFn;
                        }
                        var f = r.igaroLangFn = function() {

                            if (r.nodeName === 'META') {
                                r.content = language.mapKey(c);
                            } else if (! (r.nodeName === 'INPUT' && r.type && r.type === 'submit') && 'innerHTML' in r) {
                                r.innerHTML = language.mapKey(c);
                            } else if ('value' in r) {
                                r.value = language.mapKey(c);
                            }
                        };
                        xMgr.on('setEnv', f, { deps:[r] });
                        f();
                    }
                } else {
                    r.innerHTML = c;
                }
            },

            /* Removes all content from a DOM element and cleans events
             * @param {Node} element - DOM element to control
             * @param {boolean} [leaveRoot] - default false
             * @returns {null}
             */
            purge : function(element,leaveRoot) {

                var self = this,
                    node = element.lastChild;
                while (node) {
                    self.purge(node);
                    events.clean(node);
                    node = node.lastChild;
                }
                if (! leaveRoot) {
                    self.rm(element);
                    events.clean(element);
                }
            },

            /* Empties a DOM element of content - normally see .purge
             * @param {Node} element - DOM element to control
             * @returns {null}
             */
            empty : function(element) {

                while (element.firstChild)
                    element.removeChild(element.firstChild);
                element.innerHTML = '';
            },

            /* Removes a DOM element from its parent Node
             * @param {Node} element - DOM element to control
             * @returns {null}
             */
            rm : function(element) {

                var p = element.parentNode;
                if (p)
                    p.removeChild(element);
            },

            /* Sorts DOM Elements by a particular
             * @param {object} o - config supporting on (fn), slice, reverse, nodes (array) or root Element
             * @returns {null}
             */
            sort : function(o) {

                var slice = o.slice,
                    on = o.on || function(o) { return o.innerHTML; },
                    nodes = Array.prototype.slice.call(o.nodes || o.root.childNodes),
                    root = o.root || (o.nodes.length? o.nodes[0].parentNode : null);

                if (! root)
                    return;

                if (slice)
                    nodes = nodes.slice(slice[0],slice[1]);

                var insertBefore = nodes[nodes.length-1].nextElementSibling;
                nodes = nodes.sort(function(a, b) {

                    a = on(a);
                    b = on(b);
                    return a === b? 0: (a > b ? 1 : -1);
                });

                if (o.reverse)
                    nodes = nodes.reverse();

                nodes.forEach(function (o) {

                    root.insertBefore(o,insertBefore);
                });
            },

            /* Create manager
             * @param {object} parent - to attach manager to
             * @returns {CoreDomMgr}
             */
            createMgr : function(parent) {
                return new CoreDomMgr(parent);
            }
        };

        return dom;

    };

})(this);
