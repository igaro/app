module.exports = function(app) {

    return function(model) {

        var data = {
            desc : _tr("Storage routines for cookie, localStorage and sessionStorage. This module is only for immediate access stores."),
            author : { 
                name:'Andrew Charnley', 
                link:'http://www.igaro.com/ppl/ac' 
            },
            usage : {
                class : true
            },
            providesManager:true,
            attributes : [
                { 
                    name:'get', 
                    type:'function',
                    desc : _tr("Retrieves a value from a storage system."),
                    attributes: [
                        { 
                            type:'string', 
                            required:true,
                            attributes:[{
                                desc: _tr("The name to match. Typically the module name.")
                            }]
                        },
                        { 
                            type:'object', 
                            required:true,
                            attributes:[{
                                desc: _tr("The id to match. This and the name form the queried string.")
                            }]
                        },
                        { 
                            type:'object', 
                            required:true,
                            attributes:[
                            	{
	                            	type:'string',
	                            	name:'type',
	                                desc: _tr("The storage system to use. Set to cookie, local or session. Default is local.")
                            	}
                            ]
                        }
                    ]
                },
                { 
                    name:'set', 
                    type:'function',
                    desc: _tr("Saves a value to a storage system."),
                    attributes: [
                        { 
                            type:'string',
                            required:true,
                            attributes:[{
                                desc: _tr("The name to use. Typically the module name.")
                            }]
                        },
                        { 
                            type:'string',
                            required:true,
                            attributes:[{
                                desc: _tr("The id to use. This and the name form a unique reference.")
                            }]
                        },
                        { 
                            type:'*',
                            attributes:[{
                                desc: _tr("The value to store. Undefined removes the record.")
                            }]
                        },
                        { 
                            type:'object',
                            required:false,
                            attributes:[
                            	{
	                            	type:'string',
	                            	name:'type',
	                                desc: _tr("Set to cookie, local or session. Default is local.")
                            	}
                            ]
                        },
                    ]
                }
            ]
        };

        model.parent.stash.childsupport(data,model);

    };
};
