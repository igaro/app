//# sourceURL=route.main.modules.instance.form.validate.js

module.requires = [
    { name:'core.currency.js' }
];

module.exports = function() {

    "use strict";

    return function(model) {

        var data = {
            demo : "model.managers.object.create('form.validate',{\n\
    form: dom.mk('form',c, dom.mk('input[text]',null,null,function() {\n\
        this.name='amount';\n\
        this.required=true;\n\
        dom.setPlaceholder(this,  function() { return this.tr({ key:'Currency Amount' }); });\n\
    })),\n\
    rules: [['amount',function(v) { \n\
        if (! app['core.currency'].validate(v)) {\n\
            return {\n\
                en:'Invalid amount'\n\
            }\n\
        }\n\
    }]]\n\
})",
            desc : function() { return this.tr((({ key:"Provides form validation with native support for number, min, max, email, tel, pattern, required and length. Custom rules are supported." }))); },
            blessed:true,
            usage : {
                instantiate : true,
                attributes : [
                    {
                        name:'errorDisplayAmount',
                        type:'number',
                        desc : function() { return this.tr((({ key:"The amount of errors to show at once. Default is 1." }))); }
                    },
                    {
                        name:'form',
                        instanceof : { name:'Element' },
                        desc : function() { return this.tr((({ key:"A form element containing the inputs to validate." }))); },
                        required:true
                    },
                    {
                        name:'inRealTime',
                        type:'boolean',
                        desc : function() { return this.tr((({ key:"Defines whether the validation should run in realtime. Default is true." }))); }
                    },
                    {
                        name:'onValidSubmit',
                        type:'function',
                        desc : function() { return this.tr((({ key:"If validation passes the form will execute this function on submission." }))); }
                    },
                    {
                        name:'routine',
                        type:'function',
                        desc : function() { return this.tr((({ key:"The routine to run on any form element value change." }))); },
                        required:true,
                        returns : {
                            attributes : [
                                {
                                    instanceof : { name:'Element' },
                                    name:'near',
                                    desc: function() { return this.tr((({ key:"The element which failed validation." }))); }
                                },
                                {
                                    type:'object',
                                    name:'message',
                                    desc: function() { return this.tr((({ key:"A message pertaining to the validation failure." }))); }
                                }
                            ]
                        }
                    },
                    {
                        name:'rules',
                        instanceof : { name:'Array' },
                        desc : function() { return this.tr((({ key:"Custom rules in addition to basic rules that will be enumerated through to check if the form is valid. A rule may be asynchronous. When invalid the function should return a language literal." }))); },
                        required:true
                    }
                ]
            },

            author : {
                name:'Andrew Charnley',
                link:'http://www.igaro.com/ppl/ac'
            },
            attributes : [
                {
                    name:'addTextInputListeners',
                    type:'function',
                    desc : function() { return this.tr((({ key:"Adds onInput event listeners to text inputs. Use after adding new elements to the form." }))); }
                },
                {
                    name:'check',
                    async:true,
                    type:'function',
                    events:['validated'],
                    desc : function() { return this.tr((({ key:"Runs the validation rules and displays validation messages on those elements that fail." }))); },
                    returns : {
                        attributes:[{
                            type:'boolean',
                            desc:function() { return this.tr((({ key:"A valid pass is denoted by true." }))); }
                        }]
                    }
                },
                {
                    name:'clear',
                    async:true,
                    type:'function',
                    events:['clear'],
                    desc : function() { return this.tr((({ key:"Clears the form of any validation messages." }))); }
                },
                {
                    name:'routine',
                    type:'function',
                    desc : function() { return this.tr((({ key:"Update the validation routine by applying a new function to this attribute." }))); },
                },
                {
                    name:'setForm',
                    type:'function',
                    desc : function() { return this.tr((({ key:"Hooks up a form to the validation process." }))); },
                    attributes:[{
                        type:'object',
                        attributes: [{
                            instanceof: { name:'Element' }
                        }]
                    }]
                }
            ]
        };

        model.parent.stash.childsupport(data,model);

    };

};
