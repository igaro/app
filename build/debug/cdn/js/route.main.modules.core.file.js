module.exports = function(app) {

    return function(model) {

        var data = {
            desc : {"en":"Provides file related functionality and formatting."},
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
                                desc: {"en":"The filename to process."}
                            }]
                        }
                    ],
                    desc: {"en":"Returns a filename extension."}
                },
                { 
                    name:'formatSize', 
                    type:'function',
                    attributes: [
                        { 
                            type:'number', 
                            required:true,
                            attributes : [{
                                desc: {"en":"The filesize in bytes."}
                            }]
                        }
                    ],
                    desc: {"en":"Returns a string containing a formatted file size."}
                }
            ]
        };

        model.parent.stash.childsupport(data,model);
    };
};