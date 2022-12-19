const app = {},
  modules = [],
  { libs } = appConf;

try {

  // local libraries
  if (libs.local && document.location.protocol === 'file:') {
    modules.push.apply(modules,libs.local);
  }

  // network libraries
  if (libs.network && document.location.protocol !== 'file:') {
    modules.push.apply(modules,libs.network);
  }

  // touch libraries
  const maxTouchPoints = window.navigator.maxTouchPoints || window.navigator.msMaxTouchPoints;
  if (libs.touch && ((maxTouchPoints === undefined && 'ontouchstart' in window) || (typeof maxTouchPoints === 'number' && maxTouchPoints > 1))) {
    modules.push.apply(modules,libs.touch);
  }

  // fonts
  if (libs.fonts) {
    let b,d,e,f,g,
      h=document.body,
      a=document.createElement("div");
    a.innerHTML='<span style="'+["position:absolute","width:auto","font-size:128px","left:-99999px"].join(" !important;")+'">'+(new Array(100)).join("wi")+"</span>";
    a=a.firstChild;
    b=(b) => {
      a.style.fontFamily=b;
      h.appendChild(a);
      g=a.clientWidth;
      h.removeChild(a);
      return g;
    };
    d=b("monospace");
    e=b("serif");
    f=b("sans-serif");
    libs.fonts
      .forEach(font => {
        const a = font.name;
        if (! (d!==b(a+",monospace") || f!==b(a+",sans-serif") ||e!==b(a+",serif"))) {
          font.name ='font.'+a.toLowerCase().replace(/\ /,() => '') +'.css';
          modules.push(font);
        }
    });
  }

  // further modules - must inc conf
  modules.push.apply(modules,libs.load);

  // include built in modules (via builder)
  (function() {

    const module = {};
    @@include('builtin/core.events.js');
    app['core.events'] = module.exports(app,appConf);
  }).call(env);

  (function() {

    const module = {};
    @@include('builtin/core.object.js');
    app['core.object'] = module.exports(app,appConf);
  }).call(env);

  (function() {

    const module = {};
    @@include('builtin/core.debug.js');
    app['core.debug'] = module.exports(app,appConf);
  }).call(env);

  (function() {

    const module = {};
    @@include('builtin/core.dom.js');
    app['core.dom'] = module.exports(app,appConf);
  }).call(env);

  (function() {

    const module = {};
    @@include('builtin/instance.xhr.js');
    app['instance.xhr'] = module.exports(app,appConf);
  }).call(env);

  (function() {

    const module = {};
    @@include('builtin/instance.amd.js');
    app['instance.amd'] = module.exports(app,appConf);
  }).call(env);

  // load requested modules
  const ai = appConf.init || {};
  await new app['instance.amd']().get({
    modules:modules,
    onProgress:ai.onProgress? v => {

      ai.onProgress(app,appConf,v);
    } : null
  });

  await app['core.events'].rootEmitter.dispatch('state.init');

  if (ai.onReady) {
    await ai.onReady(app,appConf);
  }

} catch(e) {

  try {
    const init = appConf.init;
    if (init && init.onError) {
      init.onError(app,appConf,e);
    }
    app['core.debug'].error(e);
  } catch(eN) {
    throw { error:eN, originalError:e };
  }
};
