//# sourceURL=route.main.modules.core.store.js

module.exports = function() {

    "use strict";

    return function(model) {

        var data = {
            desc : _tr("Storage routines for cookie, localStorage, sessionStorage and API's."),
            author : {
                name:'Andrew Charnley',
                link:'http://www.igaro.com/ppl/ac'
            },
            usage : {
                class : true
            },
            manager:true,
            attributes : [
                {
                    name:'defaultprovider',
                    type:'object',
                    desc : _tr("Links to the object in the provider array which provides the default storage routine."),
                },
                {
                    name:'get',
                    type:'function',
                    forManager:true,
                    onlyManager:true,
                    desc : _tr("Retrieves a value from a storage system."),
                    attributes: [
                        {
                            type:'string',
                            required:true,
                            forManager:true,
                            attributes:[{
                                desc: _tr("The id to match.")
                            }]
                        },
                        {
                            type:'object',
                            required:true,
                            forManager:true,
                            attributes:[
                            	{
	                            	type:'string',
	                            	name:'type',
	                                desc: _tr("Defines the provider. Use 'cookie', 'local', 'session' or a custom provider. Default is 'local'.")
                            	}
                            ]
                        }
                    ],
                    async:true
                },
                {
                    name:'getProviderById',
                    type:'function',
                    desc : _tr("Returns a provider by it's unique id, such as 'cookie'."),
                    attributes: [
                        {
                            type:'string',
                            required:true,
                            attributes:[{
                                desc: _tr("The id to match.")
                            }]
                        }
                    ],
                    returns : {
                        attributes : [
                            {
                                type:'object'
                            }
                        ]
                    }
                },
                {
                    name:'installProvider',
                    type:'function',
                    desc : _tr("Installs and returns a new provider. Typically this is used for adding API storage methods."),
                    attributes: [
                        {
                            type:'string',
                            required:true,
                            attributes:[{
                                desc: _tr("A name to use as a unique identifier.")
                            }]
                        },
                        {
                            type:'object',
                            required:true,
                            attributes: [
                                {
                                    name:'get',
                                    type:'function',
                                    required:true,
                                    desc: _tr("The getter routine for the provider."),
                                    attributes: [
                                        {
                                            type:'string',
                                            required:true,
                                            attributes:[{
                                                desc: _tr("The unique id of the value to be retrieved.")
                                            }]
                                        }
                                    ],
                                    async:true
                                },
                                {
                                    name:'set',
                                    type:'function',
                                    required:true,
                                    desc: _tr("The setter routine for the provider."),
                                    attributes: [
                                        {
                                            type:'string',
                                            required:true,
                                            attributes:[{
                                                desc: _tr("The unique id of the value to be retrieved.")
                                            }]
                                        },
                                        {
                                            type:'*',
                                            attributes:[{
                                                desc: _tr("The value to be stored. Typically a provider will delete any matching key if this value is undefined or null.")
                                            }]
                                        },
                                        {
                                            type:'object',
                                            attributes:[
                                                {
                                                    instanceof: { name:'Date' },
                                                    desc: _tr("Defines a date/time when the value to be stored should expire. Typically if no value is supplied the provider will store the value indefinitely.")
                                                }
                                            ]
                                        }
                                    ],
                                    async:true
                                }
                            ]
                        }
                    ],
                    returns : {
                        attributes : [
                            {
                                type:'object'
                            }
                        ]
                    }
                },
                {
                    name:'providers',
                    instanceof : { name:'Array' },
                    desc : _tr("A pool for storage mechanisms. Cookie, localStorage and sessionStorage are built in.")
                },
                {
                    name:'set',
                    type:'function',
                    forManager:true,
                    onlyManager:true,
                    desc: _tr("Saves a value to a storage system."),
                    attributes: [
                        {
                            type:'string',
                            forManager:true,
                            required:true,
                            attributes:[{
                                desc: _tr("The id to use.")
                            }]
                        },
                        {
                            type:'*',
                            forManager:true,
                            attributes:[{
                                desc: _tr("The value to store. Undefined removes the record.")
                            }]
                        },
                        {
                            type:'object',
                            forManager:true,
                            required:false,
                            attributes:[
                            	{
	                            	name:'expiry',
	                            	instanceof: { name: 'Date' },
	                                desc: _tr("Specify a value to expire the data at a set time. ")
                            	},
                            	{
	                            	name:'type',
	                            	type:'string',
	                                desc: _tr("Defines the provider. Use 'cookie', 'local', 'session' or a custom provider. Default is 'local'.")
                            	},
                            ]
                        },
                    ],
                    async:true
                }
            ]
        };

        model.parent.stash.childsupport(data,model);

    };
};
