module.exports = function(app) {

    return function(model) {

        var data = {
            desc : _tr("Provides file related functionality and formatting."),
            author : { 
                name:'Andrew Charnley', 
                link:'http://www.andrewcharnley.com' 
            },
            usage : {
                class : true
            },
            attributes : [
                { 
                    name:'getExtension',
                    type:'function',
                    attributes: [
                        { 
                            type:'string', 
                            required:true, 
                            attributes : [{
                                desc: _tr("The filename to process.")
                            }]
                        }
                    ],
                    desc: _tr("Returns a filename extension.")
                },
                { 
                    name:'formatSize', 
                    type:'function',
                    attributes: [
                        { 
                            type:'number', 
                            required:true,
                            attributes : [{
                                desc: _tr("The filesize in bytes.")
                            }]
                        }
                    ],
                    desc: _tr("Returns a string containing a formatted file size.")
                }
            ]
        };

        model.parent.stash.childsupport(data,model);
    };
};