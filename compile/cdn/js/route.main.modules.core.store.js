module.exports = function(app) {

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
                    returns : {
                        attributes : [
                            {
                                instanceof: { name:'Promise' }
                            }
                        ]
                    }
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
                    returns : {
                        attributes : [
                            {
                                instanceof: { name: 'Promise' }
                            }
                        ]
                    }
                }
            ]
        };

        model.parent.stash.childsupport(data,model);

    };
};
