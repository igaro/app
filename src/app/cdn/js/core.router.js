//# sourceURL=core.router.js

(function () {

  module.requires = [
    { name: 'core.router.css' },
    { name: 'core.language.js' },
    { name: 'core.url.js' }
  ];

  module.exports = app => {

    const dom = app['core.dom'],
      coreUrl = app['core.url'],
      { bless, arrayInsert } = app['core.object'];

    /* A route, which represents a path or folder(s) on a url
     * @constructor
     */
    const CoreRouterRoute = function (o) {

      const self = this;
      this.name = o.name;
      this.container = domMgr => domMgr.mk('div', o.container, null, function () {

        this.className = 'route';
        dom.hide(this);
        self.wrapper = dom.mk('div', this, null, 'wrapper');
        if (typeof o.name === 'string') {
          this.classList.add(o.name.replace(/\./g, '--'))
        }
      });
      this.routes = [];
      this.uriPieces = [];
      this.originalUri = [];
      this.destroyOnLeave = false;
      this.defaultHideRoutes = true;
      this.defaultHideParentViewWrapper = true;
      this.defaultShowWrapper = true;
      this.autoShow = true;
      this.scrollPosition = 0;
      this.modules = {};
      bless.call(this, o);
    }

    /* Counts the level at which the route sits within the tree
     * @returns {number}
     */
    CoreRouterRoute.prototype.getTreeLevel = function () {

      let i = -1,
        parent = this;

      while (parent) {
          ++i;
          parent = parent.parent;
      }
      return i;
    }

    /* Works out if the route is base or a sibling of (therefore at the same tree level)
     * @returns {Boolean}
     */
    CoreRouterRoute.prototype.isAtBase = function () {

      return this.getTreeLevel() === router.rootPathLevel;
    }

    /* Returns a routes full uri based path
     * @returns {Array} containing paths / uri data
     */
    CoreRouterRoute.prototype.uriPath = function () {

      let parent = this,
        path = [];

      while (parent && ! parent.isAtBase()) {

        path = path.concat(parent.originalUri.slice(0, parent.uriPieces).reverse());
        path.push(parent.name);
        parent = parent.parent;
      }

      return path.reverse();
    }

    /* Shortcut to append child paths onto a routes path and call router.to
     * @param {Array} path - path(s) to append
     * @param {object} [search] - query to pass
     * @param {string} [hash] - hash to pass
     * @returns {Promise}
     */
    CoreRouterRoute.prototype.to = function (path, search, hash) {

      if (! (path instanceof Array)) {
        throw new TypeError("First argument must be instanceof Array");
      }

      return router.to(this.uriPath().concat(path), search, hash);
    }

    /* Dynamically adds a manager to an route after its been blessed
     * @param {string} name - of manager to add
     * @param {string} module - the module containing the manager
     * @returns (object} the manager
     */
    CoreRouterRoute.prototype.addManager = function (name, module) {

      if (typeof name !== 'string') {
        throw new TypeError("First argument must be of type string");
      }

      if (typeof module !== 'object' || ! module.createMgr) {
        throw new TypeError("Second argument must be an object supplying a manager");
      }

      if (this.managers[name]) {
        throw new Error('Manager already appended. Unable to add twice.');
      }

      return this.managers[name] = module.createMgr(this);
    }

    /* Captures uri data and assigns to the route to identify children.
     * For /route/data/childroute/data/, this function extracts the data, assigns to the routes
     * Further children can then be identified by the router. See online help for detailed info.
     * @param {number} n - the pieces to pull from the uri
     * @returns {Array} containing the uri parts
     */
    CoreRouterRoute.prototype.captureUri = function (n) {

      if (typeof n !== 'number' || n < 1) {
        throw new TypeError("First argument must be a number with a value greater than 0");
      }

      return this.uriPieces = this.originalUri
        .slice(0, n)
        .map(p => decodeURIComponent(p));
    }

    /* Shortcut to access a route's event manager .on function
     * @param {string} evt - event name
     * @param {function} fn - function to register
     * @param {object} [o] - optional conf, see core.events.on
     * @returns {object} event handler
     */
    CoreRouterRoute.prototype.on = function (...args) {

      return this.managers.event.on(...args);
    }

    /* Produces a path based on a route's path data.
     * @param {Array} [path] - containing folders
     * @param {object} [search] - containing query data
     * @param {string} [hash] - url hash
     * @returns {string} a url
     */
    CoreRouterRoute.prototype.getUrl = function (path, search, hash) {

      if (! path) {
        path = [];
      }
      return coreUrl.fromComponents(this.uriPath().concat(path), search, hash)
    }

    /* Reduces an array of Promises, appending dom containers upon each resolve
     * @param {object} o - config containing; o.promises, o.silent
     * @returns {Promise} containing an array of values from each Promise
     */
    CoreRouterRoute.prototype.addSequence = async function (o) {

      const values = [];

      for (let p of o.promises) {
        try {
          const container = await p;
          values.push(container);
          if (typeof container === 'object' && (container instanceof Array || container instanceof Node || container.container)) {
            dom.append(o.container, container);
          }
        } catch (e) {
          if (! o.silent) {
            this.managers.debug.handle(e);
          }
          throw e;
        }
      }
      return values;
    }

    /* Shortcut to allow a route to detect if it's the base root (ie main within header/main/footer
     * @returns {boolean}
     */
    CoreRouterRoute.prototype.isBase = function () {

      return this === router.base;
    }

    /* Returns a child route by its name (aka folder on the uri)
     * @param {string} name - to search for
     * @returns {CoreRouterRoute}
     */
    CoreRouterRoute.prototype.getRouteByName = function (name) {

      if (typeof name !== 'string') {
        throw new TypeError('First argument must be of type string');
      }
      return this.routes
        .find(route => route.name === name);
    }

    /* Adds child routes in sequence. See .addRoute
     * @param {Array} routes - to add by name
     * @returns {Promise} containing array of routes
     */
    CoreRouterRoute.prototype.addRoutes = async function (routes) {

      const loaded = [];
      for (let route of routes) {
        loaded
          .push(await this.addRoute(route));
      }
      return loaded;
    }

    /* Adds a child route to a route
     * @param {object} config - containing; o.name
     * @returns {Promise} containing route
     */
    CoreRouterRoute.prototype.addRoute = async function (o) {

      const pool = this.routes,
        name = o.name;

      // find existing
      let g = this.getRouteByName(name);

      try {

        // not found
        if (! g) {

          // instantiate new route
          g = new CoreRouterRoute({
            parent: this,
            container: this,
            name: name
          });

          // add common cleanup methods
          g.managers.event.on('destroy', () => {

            // remove from pool
            pool.splice(pool.indexOf(g), 1);

            // remove linked css
            if (g.cssElement) {
              g.managers.dom.rm(g.cssElement);
            }

            // if current route is this, set current to parent
            if (router.current === g) {
              router.current = g.parent;
            }
          });

          // get a provider for the route
          const provider = router.getProviderForPath(g.path)
          if (! provider) {
            throw { error: 'No Route provider for path', route:g };
          }
          g.url = provider.url;

          // designate fetcher
          const data = await provider.fetch(g);

          if (data.css) {
            g.cssElement = dom.mk('style', dom.head, data.css);
          }

          await data.js(g);
          arrayInsert(pool, g, o);
          await self.managers.event.dispatch('addRoute', g);
        }

        g.originalUri = o.uri || [];

        // fire events
        const gMgrEvt = g.managers.event;
        await gMgrEvt.dispatch('enter');

        // show
        if (! g._initalized) {
          await gMgrEvt.dispatch('init');
          if (g.autoShow) {
            dom.show(g.container);
          }
          g._initialized = true
        }

        if (g.defaultHideParentViewWrapper) {
          dom.hide(g.parent.wrapper);
        }
        if (g.defaultShowWrapper) {
          dom.show(g.wrapper);
        }
        if (g.defaultHideRoutes) {
          g.hideRoutes();
        }
        return g;

      } catch(e) {

        if (g) {
          await g.destroy();
        }
        throw e;
      }
    }

    /* Destroys all child routes
     * @returns {Promise}
     */
    CoreRouterRoute.prototype.removeRoutes = function () {

      return Promise.all(this.routes
        .map(m => m.destroy()));
    }

    /* Hides all child routes
     * @returns {Array} unused
     */
    CoreRouterRoute.prototype.hideRoutes = function () {

      return this.routes
        .map(m => m.hide());
    }

/*------------------------------------------------------------------------------------------------*/

    // service
    const router = {

      name: 'core.router',
      requestId : 0,
      base: null,
      current: null,
      rootPathLevel: 0,

      // detects if the current route is at base (typically the browser url is at /)
      isAtBase : function () {

        return this.current === this.base;
      },

      children : {
        providers: 'provider'
      },

      // gets a provider for a path
      getProviderForPath: function (path) {

        const { providers } = this;
        for (var i=providers.length-1; i>=0; --i) {
          if (providers[i].handles(path)) {
            return providers[i];
          }
        }
      },

      // adds a provider to the pool, allowing for multiple route sources
      addProvider : function (o) {

        o.name = 'provider';
        bless.call(o, {
          parent: this
        })
        arrayInsert(this.providers, o, o);
      },

      /* The main routing function. Handles errors making it user event sane
       * @param {(CoreURLMgr|Array)} [a] - see core.url (or make one using router.getUrl). Can also take an array of path data.
       * @param {(object|boolean)} [b] - if a is Array, this is search query data, otherwise it prevents url update. Default is null|false.
       * @param {(string|boolean)} [c] - if a is Array, this is hash data, otherwise it is unused.
       * @param {boolean} [d] - if a is Array, this defines if the url shouldn't be updated. Default is false.
       * @returns {Promise} indicating success
       */
      to: async function (a, b, c, d) {

        let url,
          noPush,
          model = router.root;

        ++router.requestId;

        if (a instanceof coreUrl.__CoreURLMgr) {
          url = a;
          noPush = b;
        } else if (a instanceof Array) {
          url = coreUrl.fromComponents(a, b, c);
          noPush = d;
        } else {
          throw new TypeError("First argument must be instance of CoreURLMgr or Array");
        }

        const { path } = url,
          base = router.base.path.slice(1),
          paths = path.length? base.concat(path) : base,
          routerEventMgr = router.managers.event,
          { requestId, current } = router;

        try {

          if (current) {

            const o = await current.managers.event.dispatch('leave');

            // unique abort identifier
            if (o && o.abort) {
              //throw -14443864;
              return;
            }

            // auto destroy on leave (route wont retain state)
            if (current.destroyOnLeave) {
              await current.destroy();
            }

            // disable route
            //await current.disable();

            // save scroll position for user return
            const s = document.body.scrollTop || document.documentElement.scrollTop;
            current.scrollPosition = s < 0? 0 : s;
          }

          await routerEventMgr.dispatch('to-begin');

          // load paths in sequence
          for (let i=0; i < paths.length; ++i) {

            // add the next route
            model = await model.addRoute({
              name:paths[i],
              uri : paths.slice(i+1),
              silent : true
            });

            // abort the load, another request has since came in
            if (router.requestId !== requestId) {
              return;
            }

            // loaded, set as current
            router.current = model;

            // skip paths?
            i += model.uriPieces.length;

            // show it now?
            if (model.autoShow) {
              model.show();
            }

            await routerEventMgr.dispatch('to-in-progress',model);
          };

          if (! noPush) {
            manageUrlChangeListener(false);
            coreUrl.setCurrent(url);
            setTimeout(() => manageUrlChangeListener(true), 300);
          }

          // scroll to hash?
          let { hash } = url;
          if (hash) {
            // prevent injection
            hash = hash.replace(/"/g,'');
            const el = document.querySelector('a[name="'+hash+'"]') || document.getElementById(hash);
            if (el) {
              if (el.scrollIntoViewIfNeeded) {
                el.scrollIntoViewIfNeeded();
              } else {
                el.scrollIntoView();
              }
            }
          } else {
            // scroll to y?
            if (typeof router.current.scrollPosition === 'number') {
              document.body.scrollTop = document.documentElement.scrollTop = router.current.scrollPosition;
            }
          }

          // all done
          await routerEventMgr.dispatch('to-loaded', model);
          await routerEventMgr.dispatch('to-end', model);

        } catch (e) {

          await routerEventMgr.dispatch('to-error', { x: model, error:e });
          await routerEventMgr.dispatch('to-end', { x: model, error:e });
          throw e;
        }
      }
    }

    bless.call(router);

    // create root route
    router.root = new CoreRouterRoute({
      name: 'route'
    });

    // use the managers from the root route to drop the service out of the chain
    router.managers = router.root.managers;

    // default current to root
    const mrv = router.current = router.root;
    mrv.container.className = 'core-router';

    //mrv.show()
    document.body.appendChild(mrv.container);

    // private helper to run router on current url
    const autoRouter = function () {
      return router.to(coreUrl.getCurrent(), true);
    }

    // window url change
    const manageUrlChangeListener = function (enabled) {
      window[(enabled? 'add' : 'remove') + 'EventListener'](coreUrl.__isHTML5? 'popstate' : 'hashchange', autoRouter);
    }

    manageUrlChangeListener(true);

    // handle current url, if not on local filesystem (aka Phonegap app)
    if (document.location.protocol !== 'file: ') {

      const path = coreUrl.getPath();
      if (path.length) {
        app['core.events'].rootEmitter.on('state.base', function () {

          // DO NOT return autoRouter - this would abort event
          autoRouter();

          // gc: remove one shot event
          return { removeEventListener: true };
        });
      }
    }

    return router;
  }

})(this)
