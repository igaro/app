/* Collects all the html files in this directory and poulates test runners into
 * this for Nightwatch to run.
 *
 * If Mocha reports 0 errors, the test passes.
 */

var self = this;
var fs = require('fs');
var unitDir = __dirname+'/../unit/';
self['Unit Tests'] = function(browser) {
    fs.readdirSync(unitDir).forEach(function(n) {
        if (n.substr(n.lastIndexOf('.')+1) !== 'html')
            return;
          browser
            .url('file://'+unitDir+n)
            .waitForElementVisible('body', 1000)
            .pause(500)
            .assert.containsText('.failures >em', '0');
    });
    browser.end();
};


