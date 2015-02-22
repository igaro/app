(function() {

'use strict';

module.requires = [
    { name:'core.language.js'},
    { name:'instance.accordion.css'}
];

module.exports = function(app) {

    var bless = app['core.bless'];

    var InstanceAccordionSection = function(o) {
        bless.call(this,{
            name:'section',
            parent:o.parent,
        });
        var self = this,
            dom = this.managers.dom,
            el = this.element = dom.mk('dl',null,null,o.className),
            dt = this.header = dom.mk('dt',el),
            p = this.parent = o.parent;
        this.content = dom.mk('dd',el,o.content);
        this.title = dom.mk('span',dt,o.title);
        this.selector = dom.mk('span',dt);
        dom.mk('div',dt);
        this.expanded = false;
        dt.addEventListener('click', function(event) {
            event.preventDefault();
            self.parent.toggleSection(self);
        });
        if (o.expand)
            this.expand();
        if (o.hide)
            this.hide();
        this.managers.event.on('destroy', function() {
            return dom.rm(el);
        });
    };
    InstanceAccordionSection.prototype.hide = function(v) {
        this.managers.dom.hide(this.element,v);
    };
    InstanceAccordionSection.prototype.show = function() {
        thie.managers.dom.show(this.element);
    };
    InstanceAccordionSection.prototype.expand = function() {
        this.element.classList.add('expand');
        this.expanded = true;
    };
    InstanceAccordionSection.prototype.collapse = function() {
        this.element.classList.remove('expand');
        this.expanded = false;
    };

    var InstanceAccordion = function(o) {
        bless.call(this,{
            name:'instance.accordion',
            parent:o.parent,
            asRoot:true
        });
        var dom = this.managers.dom;
        this.sections = [];
        this.multiExpand = o.multiExpand;
        this.container = dom.mk('div',o.container,null,'instance-accordion');
        if (o && o.sections) {
            var self = this;
            o.sections.forEach(function(s) {
                self.addSection(s);
            });
        }
        this.managers.event
            .on('section.destroy', function(s) {
                sections.splice(sections.indexOf(s),1);
            })
            .on('destroy', function() {
                return dom.rm(this.container);
            });
    };
    InstanceAccordion.prototype.addSection = function(o) {
        o.parent = this;
        var s = new InstanceAccordionSection(o),
            c = this.container;
        if (o && o.insertBefore instanceof InstanceAccordionSection) {
            c.insertBefore(s.element, o.insertBefore.element);
        } else {
            c.appendChild(s.element);
        }
        this.sections.push(s);
    };
    InstanceAccordion.prototype.expandSection = function(section) {
        if (! this.multiExpand) {
            this.sections.forEach(function (s) {
                if (s !== section)
                    s.collapse();
            });
        }
        section.expand();
    };
    InstanceAccordion.prototype.collapse = function() {
        this.sections.forEach(function(s) {
            s.collapse();
        });
    };
    InstanceAccordion.prototype.toggleSection = function(s) {
        if (s.expanded) {
            s.collapse();
        } else {
            this.expandSection(s);
        }
    };
    InstanceAccordion.prototype.hide = function(v) {
        this.managers.dom.hide(this.container,v);
    };
    InstanceAccordion.prototype.show = function() {
        this.managers.dom.show(this.container);
    };

    return InstanceAccordion;
};


})();