//# sourceURL=instance.accordion.js

module.requires = [
    { name:'core.language.js'},
    { name:'instance.accordion.css'}
];

module.exports = function(app) {

    "use strict";

    var object = app['core.object'],
        bless = object.bless,
        arrayInsert = object.arrayInsert;

    var InstanceAccordionSection = function(o) {
        this.name = 'section';
        this.container = function(dom) {
            return dom.mk('dl',o.parent);
        };
        bless.call(this,o);
        var self = this,
            dl = this.container,
            dom = this.managers.dom,
            dt = this.header = dom.mk('dt',dl,dom.mk('div'));
        this.content = dom.mk('dd',dl,o.content);
        this.title = dom.mk('span',dt,o.title);
        this.selector = dom.mk('span',dt);
        this.expanded = false;
        dt.addEventListener('click', function(event) {
            event.preventDefault();
            self.toggle();
        });
        this.managers.event.on('disable', function() {
            if (this.disabled)
                return self.collapse();
        });
        if (o.expand)
            this.expand();
    };
    InstanceAccordionSection.prototype.expand = function() {
        if (this.disabled)
            return;
        var p = this.parent;
        if (! p.multiExpand)
            p.collapseAll();
        this.container.classList.add('expand');
        this.expanded = true;
        return this.managers.event.dispatch('expand');
    };
    InstanceAccordionSection.prototype.collapse = function() {
        this.container.classList.remove('expand');
        this.expanded = false;
        return this.managers.event.dispatch('collapse');
    };
    InstanceAccordionSection.prototype.toggle = function() {
        if (this.expanded)
            return this.collapse();
        return this.expand();
    };

    var InstanceAccordion = function(o) {
        this.name = 'instance.accordion';
        this.asRoot = true;
        this.children = {
            sections:'section'
        };
        this.container = function(dom) {
            return dom.mk('div',o,null,o.className);
        };
        bless.call(this,o);
        this.multiExpand = o.multiExpand;
    };

    InstanceAccordion.prototype.init = function(o) {
        var self = this;
        return (o.sections?
            self.addSections(o.sections)
            :
            Promise.resolve()
        ).then(function() {
            return self.managers.event.dispatch('init');
        });
    };

    InstanceAccordion.prototype.addSections = function(o) {
        var self = this;
        return object.promiseSequencer(o,function(a) {
            return self.addSection(a);
        });
    };

    InstanceAccordion.prototype.addSection = function(o) {
        o.parent = this;
        var s = new InstanceAccordionSection(o);
        arrayInsert(this.sections,s,o);
        return this.managers.event.dispatch('addSection',s).then(function() {
            return s;
        });
    };
    InstanceAccordion.prototype.collapseAll = function() {
        var self = this;
        return Promise.all(this.sections.map(function (s) {
            return s.collapse();
        })).then(function() {
            return self.managers.event.dispatch('collapseAll');
        });
    };
    InstanceAccordion.prototype.expandAll = function() {
        if (! this.multiExpand)
            throw Error("Accordion multi-expand is disabled");
        var self = this;
        return Promise.all(this.sections.map(function (s) {
            if (! s.disabled)
                return s.expand();
        })).then(function() {
            return self.managers.event.dispatch('expandAll');
        });
    };
    return InstanceAccordion;
};
