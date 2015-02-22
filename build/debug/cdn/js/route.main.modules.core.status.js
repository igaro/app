module.exports = function(app) {

    return function(model) {

        var data = {

            desc : {"en":"A very simple status event emitter."},
            author : { 
                name:'Andrew Charnley', 
                link:'http://www.andrewcharnley.com' 
            },
            usage : {
                class : true
            },
            attributes : [
                { 
                    name:'append', 
                    type:'function',
                    attributes: [
                        { 
                            type:'object', 
                            required:true,
                            attributes:[{
                                desc: {"en":"Object to pass onto the event handler."},
                            }]
                        }
                    ]
                }
            ],
            related : [
                'service.status.js'
            ]
        };

        model.parent.stash.childsupport(data,model);

    };
};
