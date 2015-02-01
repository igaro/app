module.exports = function(app) {

    return function(model) {

        var data = {

            desc : {
                en : 'Provides HTML related functionality and formatting.',
                fr : 'Fournit les fonctionnalités et le formatage HTML liés.'
            },
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
                                desc: {
                                    en : 'The value to process.',
                                    fr : 'La valeur à traiter.'
                                }
                            }]
                        }
                    ],
                    desc: {
                        en : 'Converts HTML special characters into print code.',
                        fr : 'Convertit les caractères spéciaux HTML dans le code d\'impression.' 
                    }
                },
                { 
                    name:'to', 
                    type:'function',
                    attributes: [
                        { 
                            type:'string', 
                            required:true, 
                            attributes : [{
                                desc: {
                                    en : 'The value to process.',
                                    fr : 'La valeur à traiter.'
                                }
                            }]
                        }
                    ],
                    desc: {
                        en : 'Formats special characters into HTML code.',
                        fr : 'Formats des caractères spéciaux en code HTML.'
                    }
                },
                { 
                    name:'strip',
                    type:'function',
                    attributes: [
                        { 
                            type:'string', 
                            required:true,
                            attributes : [{
                                desc: {
                                    en : 'The value to process.',
                                    fr : 'La valeur à traiter.'
                                }
                            }]
                        }
                    ],
                    desc: {
                        en : 'Strips HTML from a string.',
                        fr : 'Bandes HTML à partir d\'une chaîne.'
                    }
                }
            ]

        };

        model.parent.stash.childsupport(data,model);
    };
};