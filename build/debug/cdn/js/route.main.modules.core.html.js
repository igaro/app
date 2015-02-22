module.exports = function(app) {

    return function(model) {

        var data = {

            desc : {"en":"Provides HTML related functionality and formatting."},
            author : { 
                name:'Andrew Charnley', 
                link:'http://www.andrewcharnley.com' 
            },
            usage : {
                class : true
            },
            attributes : [
                { 
                    name:'from',
                    type:'function',
                    attributes: [
                        { 
                            type:'string', 
                            required:true, 
                            attributes : [{
                                desc: {"en":"The value to process."}
                            }]
                        }
                    ],
                    desc: {"en":"Converts HTML special characters into print code."}
                },
                { 
                    name:'to', 
                    type:'function',
                    attributes: [
                        { 
                            type:'string', 
                            required:true, 
                            attributes : [{
                                desc: {"en":"The value to process."}
                            }]
                        }
                    ],
                    desc: {"en":"Formats special characters into HTML code."}
                },
                { 
                    name:'strip',
                    type:'function',
                    attributes: [
                        { 
                            type:'string', 
                            required:true,
                            attributes : [{
                                desc: {"en":"The value to process."}
                            }]
                        }
                    ],
                    desc: {"en":"Strips HTML from a string."}
                }
            ]

        };

        model.parent.stash.childsupport(data,model);
    };
};