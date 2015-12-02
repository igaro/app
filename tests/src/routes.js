// * Routes *
// Since all errors result in an error handle message we can assume if it exists something is wrong.
// Many routes contain instances, so the basics of those are also tested.
// Doesn't cover hyperlinks and user interaction.
//

var self = this;

[
    '',
    'overview',
    'features',
    'install',
    'install.license',
    'showcase',
    'showcase.todomvc',
    'structure',
    'bless',
    'async',
    'events',
    'security',
    'design',
    'routes',
    'locale',
    'mobile',
    'compat',
    'modules',
    'contact'
].concat(
    [
        '3rdparty.fastclick',
        '3rdparty.hammer',
        '3rdparty.moment',
        'conf.app',
        'core.country',
        'core.currency',
        'core.date',
        'core.debug',
        'core.dom',
        'core.events',
        'core.file',
        'core.html',
        'core.language',
        'core.object',
        'core.router',
        'core.store',
        'core.url',
        'instance.accordion',
        'instance.amd',
        'instance.bookmark',
        'instance.date',
        'instance.form.validate',
        'instance.jsonp',
        'instance.list',
        'instance.modaldialog',
        'instance.navigation',
        'instance.oauth2',
        'instance.pagemessage',
        'instance.rte',
        'instance.samespace',
        'instance.table',
        'instance.toast',
        'instance.xhr',
        'polyfill.es6',
        'polyfill.ie.8',
        'polyfill.js.1.6',
        'polyfill.js.1.8.1',
        'polyfill.js.1.8.5',
        'polyfill.js.classList'
    ].map(function(x) { return 'modules/'+x; })
).forEach(function(n) {

    self['route -> '+n] = function(browser) {

        browser
            .url('http://localhost:3006/'+n)
            .waitForElementVisible('body', 1000)
            .pause(1000)
            .assert.elementNotPresent('.igaro >.error')
            .assert.elementNotPresent('.igaro-instance-modaldialog');

        browser.end();

    }

});
