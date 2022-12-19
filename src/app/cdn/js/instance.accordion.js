//# sourceURL=instance.accordion.js

(function () {

  module.requires = [
    { name: 'core.language.js'},
    { name: 'instance.accordion.css'}
  ];

  module.exports = app => {

    const coreObject = app['core.object'],
      dom = app['core.dom'],
      { bless, arrayInsert } = coreObject;

    /* A section on an Accordion
     * @constructor
     * @params {object} o - config literal
     */
    const InstanceAccordionSection = function (o) {

      this.name = 'section';
      this.container = domMgr => domMgr.mk('dl', o.parent);
      bless.call(this, o);

      const self = this,
        dl = this.container,
        dt = this.header = dom.mk('dt', dl, dom.mk('div'));

      this.content = dom.mk('dd', dl, o.content);
      this.title = dom.mk('span', dt, o.title);
      this.selector = dom.mk('span', dt);
      this.expanded = false;
      this.managers.event.on('disable', function () {
        if (this.disabled) {
          return self.collapse();
        }
      })
      dt.addEventListener('click', function (event) {
        event.preventDefault();
        self.toggle();
      });
    };

    /* Expand a section
     * @returns {Promise}
     */
    InstanceAccordionSection.prototype.expand = async function () {

      if (this.disabled) {
        return;
      }
      const p = this.parent;
      if (! p.multiExpand) {
        p.collapseAll();
      }
      this.container.classList.add('expand');
      this.expanded = true;
      await this.managers.event.dispatch('expand');
    }

    /* Collapse a section
     * @returns {Promise}
     */
    InstanceAccordionSection.prototype.collapse = async function () {

      this.container.classList.remove('expand');
      this.expanded = false;
      await this.managers.event.dispatch('collapse');
    }

    /* Toggle a section between expanded/collapsed state
     * @returns {Promise}
     */
    InstanceAccordionSection.prototype.toggle = function () {

      return this[this.expanded? 'collapse' : 'expand']();
    }

    /* Accordion Widget
     * @params {object} o - config literal
     * @constructor
     * @returns {InstanceAccordion}
     */
    const InstanceAccordion = function (o) {

      this.name = 'instance.accordion';
      this.asRoot = true;
      this.children = {
        sections: 'section'
      }
      this.container = function (dom) {
        return dom.mk('div', o, null, o.className);
      }
      bless.call(this, o);
      this.multiExpand = o.multiExpand;
    }

    /* Async constructor
     * @params {object} o - config literal
     * @returns {Promise}
     */
    InstanceAccordion.prototype.init = async function (o) {

        var self = this;
        if (o.sections) {
          await self.addSections(o.sections);
        }
        await self.managers.event.dispatch('init');
        if (o.expand) {
          return self.expandAll();
        }
    }

    /* Shortcut to call .addSection in sequence
     * @params {Array} [o] of sections to create
     * @returns {Promise} containing created sections
     */
    InstanceAccordion.prototype.addSections = async function (sections) {

      const newSections = [];
      for (section of sections) {
        newSections.push(await this.addSection(section));
      }
      return newSections;
    }

    /* Creates a new section
     * @params {object} [o] config literal
     * @returns {Promise} containing array of sections
     */
    InstanceAccordion.prototype.addSection = async function (o) {

      o = o || {};
      o.parent = this;
      const s = new InstanceAccordionSection(o);
      arrayInsert(this.sections, s, o);
      await this.managers.event.dispatch('addSection', s);
      if (o.expand) {
        await s.expand();
      }
      return s;
    }

    /* Collapse all sections
     * @returns {Promise}
     */
    InstanceAccordion.prototype.collapseAll = async function () {

      await Promise.all(this.sections.map(s => s.collapse()));
      await this.managers.event.dispatch('collapseAll');
    }

    /* Expand all sections
     * @returns {Promise}
     */
    InstanceAccordion.prototype.expandAll = async function () {

      if (! this.multiExpand) {
        throw Error("Accordion multi-expand is disabled");
      }

      await Promise.all(this.sections.map(async s => {

        if (! s.disabled) {
          await s.expand();
        }
      }));

      await this.managers.event.dispatch('expandAll');
    }

    return InstanceAccordion;
  }

})(this);
