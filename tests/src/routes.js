// * Routes *
// Since all errors result in an error handle message we can assume if it exists something is wrong.
// Many routes contain instances, so the basics of those are also tested.
// Doesn't test hyperlinks and user interaction.
//
var self = this;
[
'overview','features','install','install.license',
'structure','bless','async','events','design','routes','locale','mobile','compat','modules',
// todo: module documentation
'contact'
].forEach(function(n) {

    self['route.main.'+n] = function(browser) {

      var x = n.replace(/\./g,'/');
      browser
        .url('http://localhost:3006/'+x)
        .waitForElementVisible('body', 1000)
        .pause(500)
        .assert.elementNotPresent('.igaro >.error')
        .assert.elementNotPresent('.instance-modaldialog')
        .end();

    };

});



