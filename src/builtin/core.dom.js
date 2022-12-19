(function() {

  module.exports = app => {

    const coreEvents = app['core.events'];

    // private function to dive into an object and return its container, if it's not a Node object member already
    const getContainer = o => {

      if (!(o instanceof HTMLElement || o instanceof DocumentFragment) && o.container) {
        return o.container;
      }
      return o;
    };

    /* Manager
     * @constructor
     * @param {object} parent - parent the dom manager belongs to
     */
    const CoreDomMgr = function (parent) {

      this.parent = parent;
    };

    /* Makes a DOM element and adds it to a particular place.
     * @param {string} t - name of dom element, i.e div
     * @param {object} [o] - dom element to append the object into. Can also be a literal containing prepend, insertBefore etc
     * @param {object|object[]} [c] - dom elements to append into the new object. Can also be objects containing a container attribute, aka Igaro blessed object.
     * @returns {Node} Dom Element
     */
    CoreDomMgr.prototype.mk = function(t,o,c,m) {

      const r = dom.mk.call(this,t,o,c,m);
      this.parent.managers.event.on('destroy', () => dom.rm(r), { deps:[r] });
      return r;
    };

    /* Destroys the object (clean up ops)
     * @returns {Promise} containing null
     */
    CoreDomMgr.prototype.destroy = async function() {

      this.parent = null;
    };

    // service
    const dom = {
      head: document.getElementsByTagName('head')[0],
      mk: (t,o,c,m) => {

        let r,
          i,
          type = t.indexOf('[');
        if (type !== -1) {
          r = document.createElement(t.substr(0,type));
          r.type = t.slice(type+1,-1);
        } else {
          r = document.createElement(t);
        }
        if (t === 'a') {
          r.href='';
        }
        switch (typeof m) {
          case 'string' :
            r.className = m;
            break;
          case 'function' :
            try {
              m.call(r);
            } catch (e) {
              throw { error: e, fn:m.toString() };
            }
            break;
        }
        if (o && typeof o === 'object') {
          if (o instanceof HTMLElement || o instanceof DocumentFragment) {
            o.appendChild(r);
          } else if (o.prepend) {
            i.parentNode.insertBefore(r,i.parentNode.firstChild);
          } else if (o.insertBefore) {
            i = o.insertBefore;
            if (!(i instanceof HTMLElement)) {
              i = i.container;
            }
            i.parentNode.insertBefore(r,i);
          } else if (o.insertAfter) {
            i = o.insertAfter;
            if (!(i instanceof HTMLElement)) {
              i = i.container;
            }
            i.parentNode.insertBefore(r,i.nextSibling);
          } else if (o.container) {
            o.container.appendChild(r);
          }
        }
        if (c) {
          dom.setContent.call(this,r,c);
        }
        return r;
      },

      /* Sets the placeholder attribute for a DOM element and listens to language change
       * @param {Node} r - DOM element
       * @param {function} setter - to return content string
       * @returns {null}
       */
      setPlaceholder: function(r,getter) {

        const language = app['core.language'],
          xMgr = language.managers.event;
        let setter = r.igaroPlaceholderFn;
        if (typeof getter !== 'function') {
          throw new TypeError('Second argument must be of type function.');
        }
        if (! language) {
          throw new Error('core.dom -> core.language is not loaded.');
        }
        if (setter) {
          xMgr.remove(setter,'setEnv');
        }
        setter = r.igaroPlaceholderFn = () => {
          r.placeholder = getter.call({ tr: language.tr, substitute:language.substitute }, this);
        };
        xMgr.on('setEnv', setter, { deps:[r] });
        setter();
      },

      /* Hides a DOM element - shortcut className appender
       * @param {Node} r - DOM element
       * @param {boolean} [v] - whether to hide (default true)
       * @returns {null}
       */
      hide: function(r, hide) {

        r = getContainer(r);
        if (! (r instanceof Node)) {
          throw new TypeError('No DOM element supplied');
        }
        r.classList[typeof hide === 'boolean' && hide === false? 'remove' : 'add']('core-dom-hide');
      },

      /* Detects if a DOM element is visible
       * @param {Node} r - DOM element
       * @returns {boolean}
       */
      isHidden: function(r) {

        r = getContainer(r);
        const style = window.getComputedStyle(r);
        let t = r;
        while (t.parentNode && ! t.classList.contains('core-dom-hide')) {
          t = t.parentNode;
        }
        if (! (t instanceof HTMLDocument)) {
          return true;
        }
        return style.visibility === 'hidden' || style.display === 'none';
      },

      /* Toggles the display of a DOM element - shortcutter sugar
       * @param {Node} r - DOM element
       * @returns {boolean} whether now hidden
       */
      toggleVisibility: function(r) {

        r = getContainer(r);
        if (! (r instanceof Node)) {
          throw new TypeError('No DOM element supplied');
        }
        this.hide(r,! r.classList.contains('core-dom-hide'));
        return ! this.isHidden(r);
      },

      /* Shows a DOM element - shortcut className remover
       * @param {Node} r - DOM element
       * @param {boolean} [hide] - whether to hide (default false)
       * @returns {null}
       */
      show: function(r, hide) {

        return this.hide(r, !! hide);
      },

      /* Works out an objects position coordinates through the tree
       * @param {Node} r - DOM element
       * @returns {object} containing x and y values
       */
      offset: function(r) {

        let x = 0,
          y = 0;
        if (! (r instanceof Node)) {
          throw new TypeError('No DOM element supplied');
        }
        while (r) {
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
      append: function (r,c,o) {

        if (c instanceof Array) {
          return c
            .forEach(a => this.append(r,a,o));
        };
        r = getContainer(r);
        c = getContainer(c);
        if (o && o.insertBefore) {
          r.insertBefore(c,getContainer(o.insertBefore));
        } else if (o && o.insertAfter) {
          const insertAfter = getContainer(o.insertAfter);
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
       * @param {Node|object} r - DOM element to control or object containing a container
       * @param {(Node|string|object|function)} c - DOM Elements, text or a language literal
       * @param {boolean} purge=true - whether to clear the control, default true
       * @returns {null}
       */
      setContent: function (r,c,purge) {

        const type = typeof c;

        if (typeof r === 'object' && r.container) {
          r = r.container;
        }
        if (! (r instanceof Node)) {
          throw new TypeError("First argument must be instanceof Node or an object with a container attribute containing one");
        }
        if (purge !== false) {
          dom.purge.call(this,r,true);
          r.textContent = '';
        }
        switch (type) {
          case 'object':
            if (c instanceof Array) {
              c.forEach(o => {
                if (o) {
                  dom.setContent.call(this,r,o,false);
                }
              });
            } else if (c instanceof HTMLElement || c instanceof DocumentFragment) {
              r.appendChild(c);
            } else if (c.hasOwnProperty('container')) {
              r.appendChild(c.container);
            }
            break;
          case 'function':
            const language = app['core.language'],
              xMgr = language.managers.event,
              lf = r.igaroLangFn;
            if (! language) {
              throw new Error('core.dom -> core.language is not loaded.');
            }
            const getContent = () => c.call({ tr: language.tr, substitute:language.substitute },this);
            let content = getContent();
            // is it language?
            if (typeof content === 'string') {

              if (lf) {
                xMgr.remove(lf,'setEnv');
                delete r.igaroLangFn;
              }
              // updates the element text on lang env change
              const setLang = r.igaroLangFn = () => {

                const v = content || getContent();
                content = null;
                if (r.nodeName === 'META') {
                  r.content = v;
                } else if (r.nodeName === 'OPTGROUP') {
                  r.label = v;
                } else if (r.nodeName === 'INPUT' && r.type && ! /radio|checkbox/.test(r.type)) {
                  r.value = v;
                } else if ('innerHTML' in r) {
                  r.innerHTML = v;
                } else {
                  throw { error:"Unable to set language due to unrecognized node type", node:r };
                }
              };
              xMgr.on('setEnv', setLang, { deps:[r] });
              setLang();
            } else {
              // function returned something else, probably a DOM Element, Array of...
              dom.setContent.call(this,r,content,false);
            }
            break;
          default:
            r.innerHTML = c;
        }
      },

      /* Removes all content from a DOM element and cleans events
       * @param {Node} element - DOM element to control
       * @param {boolean} [leaveRoot] - default false
       * @returns {null}
       */
      purge: function(element,leaveRoot) {

        let node = element.lastChild;
        if (! (element instanceof Node)) {
          throw new TypeError("First argument must be instanceof Node");
        }
        while (node) {
          this.purge(node);
          coreEvents.clean(node);
          node = node.lastChild;
        }
        if (! leaveRoot) {
          this.rm(element);
          coreEvents.clean(element);
        }
        element.textContent = '';
      },

      /* Empties a DOM element of content - normally see .purge
       * @param {Node} element - DOM element to control
       * @returns {null}
       */
      empty: function(element) {

        if (! (element instanceof Node)) {
          throw new TypeError("First argument must be instanceof Node");
        }
        element.textContent = '';
      },

      /* Removes a DOM element from its parent Node
       * @param {Node} element - DOM element to control
       * @returns {null}
       */
      rm: function(element) {

        const p = element.parentNode;
        if (p) {
          p.removeChild(element);
        }
      },

      /* Sorts DOM Elements by a particular
       * @param {object} o - config supporting on (fn), slice, reverse, nodes (array) or root Element
       * @returns {null}
       */
      sort: function(o) {

        const slice = o.slice,
          on = o.on || function(o) { return o.innerHTML; },
          root = o.root || (o.nodes.length? o.nodes[0].parentNode : null);
        let nodes = Array.prototype.slice.call(o.nodes || o.root.childNodes);

        if (! root) {
          return;
        }

        if (slice) {
          nodes = nodes.slice(slice[0],slice[1]);
        }

        const firstNode = nodes[nodes.length-1];
        if (! firstNode) {
          return;
        }

        const insertBefore = firstNode.nextElementSibling;
        nodes = nodes.sort((a, b) => {

          a = on(a);
          b = on(b);
          return a === b? 0: (a > b ? 1 : -1);
        });

        if (o.reverse) {
          nodes = nodes.reverse();
        }

        nodes
          .forEach(o => root.insertBefore(o,insertBefore));
      },

      /* Create manager
       * @param {object} parent - to attach manager to
       * @returns {CoreDomMgr}
       */
      createMgr: function(parent) {

        return new CoreDomMgr(parent);
      }
    };

    return dom;
  };

})(this);
