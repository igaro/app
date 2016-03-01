//# sourceURL=instance.accordion.js

(function(env) {

    module.requires = [
        { name:'core.language.js'},
        { name:'instance.accordion.css'}
    ];

    module.exports = function(app) {

        "use strict";

        var object = app['core.object'],
            bless = object.bless,
            arrayInsert = object.arrayInsert;

        /* A section on an Accordion
         * @constructor
         * @params {object} o - config literal
         */
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
            this.managers.event.on('disable', function() {
                if (this.disabled)
                    return self.collapse();
            });
            if (o.expand)
                this.expand();

            dt.addEventListener('click', function(event) {
                event.preventDefault();
                self.toggle();
            });
        };

        /* Expand a section
         * @returns {Promise}
         */
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

        /* Collapse a section
         * @returns {Promise}
         */
        InstanceAccordionSection.prototype.collapse = function() {

            this.container.classList.remove('expand');
            this.expanded = false;
            return this.managers.event.dispatch('collapse');
        };

        /* Toggle a section between expanded/collapsed state
         * @returns {Promise}
         */
        InstanceAccordionSection.prototype.toggle = function() {

            return this[this.expanded? 'collapse' : 'expand']();
        };

        /* Accordion Widget
         * @params {object} o - config literal
         * @constructor
         * @returns {InstanceAccordion}
         */
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

        /* Async constructor
         * @params {object} o - config literal
         * @returns {Promise}
         */
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

        /* Shortcut to call .addSection in sequence
         * @params {Array} [o] of sections to create
         * @returns {Promise} containing created sections
         */
        InstanceAccordion.prototype.addSections = function(o) {

            var self = this;
            return object.promiseSequencer(o,function(a) {

                return self.addSection(a);
            });
        };

        /* Creates a new section
         * @params {object} [o] config literal
         * @returns {Promise} containing array of sections
         */
        InstanceAccordion.prototype.addSection = function(o) {

            o = o || {};
            o.parent = this;
            var s = new InstanceAccordionSection(o);
            arrayInsert(this.sections,s,o);
            return this.managers.event.dispatch('addSection',s).then(function() {

                return s;
            });
        };

        /* Collapse all sections
         * @returns {Promise}
         */
        InstanceAccordion.prototype.collapseAll = function() {

            var self = this;
            return Promise.all(this.sections.map(function(s) {

                return s.collapse();
            })).then(function() {

                return self.managers.event.dispatch('collapseAll');
            });
        };

        /* Expand all sections
         * @returns {Promise}
         */
        InstanceAccordion.prototype.expandAll = function() {

            if (! this.multiExpand)
                throw Error("Accordion multi-expand is disabled");

            var self = this;
            return Promise.all(this.sections.map(function(s) {

                if (! s.disabled)
                    return s.expand();
            })).then(function() {

                return self.managers.event.dispatch('expandAll');
            });
        };

        return InstanceAccordion;
    };

})(this);
