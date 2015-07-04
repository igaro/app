//# sourceURL=route.main.modules.instance.rte.js

module.exports = function() {

    "use strict";

    return function(model) {

        var data = {

            demo : "model.managers.object.create('rte', { container:c })",
            desc : _tr("Provides data input via a rich text formatted display and html conversion."),
            blessed: {
                container:true
            },
            usage : {
                instantiate : true,
                decorateWithContainer:true,
                attributes : [
                    {
                        name:'html',
                        type:'string',
                        desc : _tr("An initial value to insert into the container.")
                    },
                    {
                        name:'onChange',
                        type:'function',
                        desc : _tr("A callback function to be triggered upon data change. Returns the raw data.")
                    }
                ]
            },
            attributes : [
                {
                    name:'addPanel',
                    type:'function',
                    desc: _tr("Appends a new panel (plugin) into the RTE view allowing to expand on the basic functionality."),
                    attributes : [
                        {
                            type:'object',
                            required:true,
                            attributes : [
                                {
                                    desc: _tr("A language literal for the tab.")
                                }
                            ]
                        },
                        {
                            type:'object',
                            required:true,
                            attributes : [
                                {
                                    instanceof : { name:"Element" },
                                    desc: _tr("A div to be displayed when the tab is activated.")
                                }
                            ]
                        },
                        {
                            type:'boolean',
                            attributes : [
                                {
                                    desc: _tr("Defines whether the panel should be set as current. Default is false.")
                                }
                            ]
                        }
                    ]
                },
                {
                    name:'execCommand',
                    type:'function',
                    desc: _tr("Directly executes a command on the WYSIWYG container. See ECMA spec."),
                    attributes : [
                        {
                            type:'string',
                            required:true,
                            attributes : [
                                {
                                    desc : _tr("Command to pass to the RTE.")
                                }
                            ]
                        },
                        {
                            type:'*',
                            attributes : [
                                {
                                    desc : _tr("Attribute to pass with the RTE command.")
                                }
                            ]
                        }
                    ]
                },
                {
                    name:'getHTML',
                    type:'function',
                    desc: _tr("Returns the current HTML trimmed of white space."),
                    returns : {
                        attributes : [{
                            type:'string'
                        }]
                    }
                },
                {
                    name:'insertHTML',
                    type:'function',
                    desc: _tr("Inserts HTML at the current cursor position."),
                    attributes : [
                        {
                            required:true,
                            type:'string'
                        }
                    ]
                },
                {
                    name:'raw',
                    desc : _tr("Element containing the raw code."),
                    instanceof : {
                        name:'Element'
                    }
                },
                {
                    name:'rte',
                    instanceof : {
                        name:'Element'
                    },
                    desc : _tr("Element (contentEditable) containing the WYSIWYG.")
                },
            ],
            author : {
                name:'Andrew Charnley',
                link:'http://www.igaro.com/ppl/ac'
            },
            extlinks : [
                'https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla',
                'https://developer.mozilla.org/en-US/docs/Web/API/document.queryCommandSupported',
                'https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Content_Editable'
            ]
        };

        model.parent.stash.childsupport(data,model);
    };
};
