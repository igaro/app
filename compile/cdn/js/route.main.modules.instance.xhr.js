//# sourceURL=route.main.modules.instance.xhr.js

module.exports = function() {

    "use strict";

    return function(model) {

        var data = {
            desc : _tr("Asynchronously fetches and returns data from a resource."),
            blessed:true,
            author : {
                name:'Andrew Charnley',
                link:'http://www.igaro.com/ppl/ac'
            },
            demo : "dom.mk('button', c, { en: 'Get JSON', }).addEventListener('click', function () {\n\
    var self = this;\n\
    model.managers.object.create('xhr').then(function (xhr) {\n\
        return xhr.get({ res:'http://www.igaro.com/misc/demo.json' }).then(\n\
            function(data) {\n\
                c.insertBefore(dom.mk('div',null,JSON.stringify(data)), self);\n\
                c.removeChild(self);\n\
            }\n\
        );\n\
    }).catch(function(e) {\n\
        return model.managers.debug.handle(e);\n\
    });\n\
});",
            usage : {
                instantiate : true,
                attributes : [
                    {
                        name:'expectedContentType',
                        type:'string',
                        desc:_tr("Defines whether the content-type header returned by the transaction should match a particular value, i.e 'json'.")
                    },
                    {
                        name:'headers',
                        type:'*',
                        desc: _tr("An object literal of headers to be sent. May be a function to attain values on point of call.")
                    },
                    {
                        name:'form',
                        instanceof : { name:'Element' },
                        desc : _tr("Calls .applyForm()."),
                    },
                    {
                        name:'silent',
                        type:'boolean',
                        desc:_tr("Prevents dispatch of the execution event which in turn prevents user awareness icons/animation (where available).")
                    },
                    {
                        name:'res',
                        required:true,
                        type:'string',
                        desc : _tr("The resource, i.e URL, to load. Note that you can also specify this instead of the configuration literal.")
                    },
                    {
                        name : 'withCredentials',
                        type : 'boolean',
                        desc : _tr("Enables CORS over XHR.")
                    },
                    {
                        name:'vars',
                        type:'*',
                        desc: _tr("An object literal of name/value pairs to sent. May be a function to attain values on point of call.")
                    }
                ]
            },
            attributes : [
                {
                    name:'abort',
                    type:'function',
                    async:true,
                    desc: _tr("Aborts the XHR operation (if it is currently running). Note that once aborted some browsers such as IE will not allow the XHR to be reused."),
                },
                {
                    name:'aborted',
                    type:'boolean',
                    desc:_tr("Defines whether the last transaction was aborted.")

                },
                {
                    name:'response',
                    type:'boolean',
                    desc:_tr("Indicates if a response was received.")

                },
                {
                    name:'applyForm',
                    type:'function',
                    desc : _tr("Enumerates over a form and caches the values to be sent. If the XHR is resent you must re-run this to send modified form data."),
                    attributes : [{
                        type:'object',
                        attributes: [{
                            instanceof : { name:'Element' },
                            desc : _tr("A form to send. Element values will be enumerated once allowing you to keep the same values on resend. Call again to refresh.")
                        }]
                    }]
                },
                {
                    name:'connectionFailure',
                    type:'boolean',
                    desc:_tr("Defines whether the last transaction failed due to a connection failure.")
                },
                {
                    name:'delete',
                    type:'function',
                    async:true,
                    desc: _tr("Sends a DELETE command to the server."),
                    attributes : [{
                        type:'object',
                        attributes : [{
                            desc: _tr("Any of the instantiated properties can be set here to update the XHR before it is sent.")
                        }]
                    }],
                },
                {
                    name:'head',
                    type:'function',
                    async:true,
                    desc: _tr("Sends a HEAD command to the server."),
                    attributes : [{
                        type:'object',
                        attributes : [{
                            desc: _tr("Any of the instantiated properties can be set here to update the XHR before it is sent.")
                        }]
                    }]
                },
                {
                    name:'headers',
                    type:'*',
                    desc:_tr("A literal containing headers to be sent with the transaction. May be a function to attain values on point of call.")
                },
                {
                    name:'get',
                    type:'function',
                    async:true,
                    desc: _tr("Sends a GET command to the server."),
                    attributes : [{
                        type:'object',
                        attributes : [{
                            desc: _tr("Any of the instantiated properties can be set here to update the XHR before it is sent.")
                        }]
                    }]
                },
                {
                    name:'options',
                    type:'function',
                    async:true,
                    desc: _tr("Sends an OPTIONS command to the server."),
                    attributes : [{
                        type:'object',
                        attributes : [{
                            desc: _tr("Any of the instantiated properties can be set here to update the XHR before it is sent.")
                        }]
                    }]
                },
                {
                    name:'post',
                    type:'function',
                    async:true,
                    desc: _tr("Sends a POST command to the server."),
                    attributes : [{
                        type:'object',
                        attributes : [{
                            desc: _tr("Any of the instantiated properties can be set here to update the XHR before it is sent.")
                        }]
                    }]
                },
                {
                    name:'put',
                    type:'function',
                    async:true,
                    desc: _tr("Send a PUT command to the server."),
                    attributes : [{
                        type:'object',
                        attributes : [{
                            desc: _tr("Any of the instantiated properties can be set here to update the XHR before it is sent.")
                        }]
                    }]
                },
                {
                    name:'trace',
                    type:'function',
                    async:true,
                    desc:  _tr("Sends a TRACE command to the server."),
                    attributes : [{
                        type:'object',
                        attributes : [{
                            desc: _tr("Any of the instantiated properties can be set here to update the XHR before it is sent.")
                        }]
                    }]
                },
                {
                    name:'vars',
                    type:'*',
                    desc:_tr("A literal containing headers to be sent with the transaction. May also be a function for attaining values on point of call. For post")
                },
                {
                    name:'withCredentials',
                    type:'boolean',
                    desc : _tr("Enable CORS over XHR. Usual browser limitations apply.")
                },
                {
                    name:'xhr',
                    instanceof: { name:'XMLHttpRequest' },
                    desc : _tr("A reference to the XMLHttpRequest object.")
                }
            ],

            extlinks : [
                {
                    name:'W3C RFC2616',
                    href:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html'
                }
            ]

        };

        model.parent.stash.childsupport(data,model);

    };

};
