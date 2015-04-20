module.exports = function(app) {

    return function(model) {

        var data = {

            desc : _tr("Provides HTML related functionality and formatting."),
            author : { 
                name:'Andrew Charnley', 
                link:'http://people.igaro.com/ac' 
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
                                desc: _tr("The value to process.")
                            }]
                        }
                    ],
                    desc: _tr("Converts HTML special characters into print code.")
                },
                { 
                    name:'to', 
                    type:'function',
                    attributes: [
                        { 
                            type:'string', 
                            required:true, 
                            attributes : [{
                                desc: _tr("The value to process.")
                            }]
                        }
                    ],
                    desc: _tr("Formats special characters into HTML code.")
                },
                { 
                    name:'strip',
                    type:'function',
                    attributes: [
                        { 
                            type:'string', 
                            required:true,
                            attributes : [{
                                desc: _tr("The value to process.")
                            }]
                        }
                    ],
                    desc: _tr("Strips HTML from a string.")
                }
            ]

        };

        model.parent.stash.childsupport(data,model);
    };
};