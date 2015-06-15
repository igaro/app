// * 404 error *
// Tests a route 404 generated.
//

this['core.router.404'] = function(browser) {

  browser
    .url('http://localhost:3006/noexist/noexist')
    .waitForElementVisible('body', 1000)
    .pause(500)
    .assert.elementPresent('.igaro-instance-modaldialog')
    .end();

};



