//# sourceURL=route.main.modules.instance.samespace.js

module.requires = [
    { name: 'route.main.modules.instance.samespace.css' },
];

module.exports = function() {

    "use strict";

    return function(model) {

        var data = {

            demo : "model.managers.object.create('samespace', {\n\
    container:c,\n\
    spaces:[0,1,2].map(function(x,i) { return { className:'a'+i }; }),\n\
    transparent:true\n\
});",
            desc : function() { return this.tr((({ key:"Provides a means for multiple elements to occupy the same space on a page with navigation and CSS3 transition effects." }))); },
            blessed: {
                container:true,
                children:['spaces']
            },
            objects : {
                space : {
                    name:'Space',
                    blessed : {
                        container:true
                    }
                }
            },
            usage : {
                instantiate : true,
                decorateWithContainer:true,
                attributes : [
                    {
                        name:'delay',
                        type:'number',
                        desc : function() { return this.tr((({ key:"In slideshow mode this is the delay between transitions, measured in milliseconds." }))); },
                    },
                    {
                        name:'loop',
                        type:'boolean',
                        desc : function() { return this.tr((({ key:"Set to true to loop when the navigation cycle reaches the end. Default is true." }))); }
                    },
                    {
                        name:'spaces',
                        instanceof: { name:'Array' },
                        desc : function() { return this.tr((({ key:"Calls .addSpaces()." }))); }
                    },
                    {
                        name:'start',
                        type:'boolean',
                        desc: function() { return this.tr((({ key:"Auto starts the automated transitioning between spaces. Default is false." }))); }
                    },
                    {
                        name:'transparent',
                        type:'boolean',
                        desc : function() { return this.tr((({ key:"By default each space's canvas background is set to black. Supply true to disable." }))); }
                    }
                ]
            },
            attributes : [
                {
                    name:'addSpace',
                    type:'function',
                    async : true,
                    events:['addSpace'],
                    desc: function() { return this.tr((({ key:"Creates a Space object." }))); },
                    returns : {
                        instanceof : function() { return data.objects.space; }
                    },
                    attributes : [
                        {
                            type:'object',
                            required:true,
                            attributes : [{
                                decorateWithContainer : true
                            }]
                        }
                    ]
                },
                {
                    name:'addSpaces',
                    type:'function',
                    async : true,
                    desc: function() { return this.tr((({ key:"Calls .addSpace() in sequence." }))); },
                    returns : {
                        attributes :[{
                            instanceof : { name:'Array' }
                        }]
                    },
                    attributes : [
                        {
                            type:'object',
                            required:true,
                            attributes : [{
                                instanceof : { name:'Array' }
                            }]
                        }
                    ]
                },
                {
                    name:'nav',
                    instanceof : { name:'Element' },
                    desc : function() { return this.tr((({ key:"Navigation controls. See instance.samespace.css for customizing how and when this is displayed." }))); }
                },
                {
                    name:'stop',
                    type:'function',
                    async : true,
                    events:['stop'],
                    desc: function() { return this.tr((({ key:"Stops the automated transitioning between spaces." }))); }
                },
                {
                    name:'start',
                    type:'function',
                    async: true,
                    events:['start'],
                    desc: function() { return this.tr((({ key:"Begins the automated transitioning between spaces." }))); }
                },
                {
                    name:'to',
                    type:'function',
                    async : true,
                    events:['to'],
                    desc: function() { return this.tr((({ key:"Navigates to a space." }))); },
                    attributes : [
                        {
                            type:'element',
                            required: true,
                        }
                    ]
                }
            ],
            author : {
                name:'Andrew Charnley',
                link:'http://www.igaro.com/ppl/ac'
            }
        };

        model.parent.stash.childsupport(data,model);
    };
};
