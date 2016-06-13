//# sourceURL=route.main.showcase.js

(function () {

"use strict";

module.requires = [
    { name: 'route.main.showcase.css' }
];

module.exports = function(app) {

    return function(model) {

        var wrapper = model.wrapper,
            domMgr = model.managers.dom;

        model.stash.title=function() { return this.tr((({ key:"Showcase" }))); };
        model.stash.description=function() { return this.tr((({ key:"A showcase of App's and examples." }))); };

        domMgr.mk('p',wrapper,function() { return this.tr((({ key:"Made something with Igaro App? Send us a link!" }))); });

        domMgr.mk('h1',wrapper,"TodoMVC");

        domMgr.mk('p',wrapper,function() { return this.tr((({ key:"The TodoMVC project aims to compare Frameworks." }))); });

        domMgr.mk('div',wrapper,null,"todomvc");

        domMgr.mk('p',wrapper,
            domMgr.mk('button',null,function() { return this.tr((({ key:"Show Igaro App Implementation" }))); }, function() {
                this.addEventListener('click',function() {
                    model.to(['todomvc']);
                });
            })
        );

        domMgr.mk('h1',wrapper,"D1");

        domMgr.mk('p',wrapper,function() { return this.tr((({ key:"The D1 is the worlds most efficient and robust Bicycle Dynamo to USB power converter. It's quick one page website uses many of Igaro App's built in widgets." }))); });

        domMgr.mk('div',wrapper,null,"d1");

        domMgr.mk('p',wrapper,
            domMgr.mk('button',null,function() { return this.tr((({ key:"Show D1 Homepage" }))); }, function() {
                this.addEventListener('click',function() {
                    window.open("http://d1.igaro.com");
                });
            })
        );

    };

};

})();
