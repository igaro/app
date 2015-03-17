module.exports = function(app) {

    return function(model) {

        var data = {

            demo : " \n \
model.managers.object.create('list',{ \n \
    container:c, \n \
    options : [ \n \
        { text:{ en : '1' }}, \n \
        { text:{ en : '2' }}, \n \
        { text:{ en : '3' }} \n \
    ] \n \
}).then(function(l) { \n \
    var x = l.pool[0]; \n \
    dom.mk('button',c,'Move #1 down').addEventListener('click', function() { \n \
        l.shift(x,1); \n \
    }); \n \
});",
            desc : {
                en : 'Provides an array like list mapped to a UL and LI elements.',
                fr : 'Fournit un tableau comme liste mappé à une UL et LI éléments.'
            },
            usage : {
                instantiate : true,
                attributes : [
                    { 
                        name:'container', 
                        type:'element',
                        desc : {
                            en : 'Container to append the instance into.',
                            fr : 'Conteneur pour ajouter l\'instance en.'
                        }
                    },
                    { 
                        name:'options', 
                        type:'array',
                        desc : {
                            en : 'An array of initial items to use for the list. Array items must be object. Calls add() for each item.',
                            fr : 'Un tableau d\'éléments initiaux à utiliser pour la liste. Éléments de tableau doivent être l\'objet. Appels ajouter () pour chaque élément.'
                        }
                    }
                ]
            },
            author : { 
                name:'Andrew Charnley', 
                link:'http://www.andrewcharnley.com' 
            },
            attributes : [
                { 
                    name:'add', 
                    type:'function',
                    desc : {
                        en : 'Adds an object to the list optionally shifting it to a specified position. The object will have an LI element appended into it at Object.li.',
                        fr : 'Ajoute un objet à la liste éventuellement il passer à une position spécifiée. L\'objet aura un élément LI ajouté en elle à Object.li.'
                    },
                    attributes : [
                        {
                            type:'object',
                            required:true,
                            attributes:[
                                {
                                    name:'id',
                                    type:'string',
                                    desc: {
                                        en : 'If supplied the value will be appended to LI.className.',
                                        fr : 'Si la valeur fournie sera ajouté à la LI.className.'
                                    }
                                },
                                {
                                    name:'text',
                                    type:'object',
                                    desc: {
                                        en : 'Append a language object text into the LI and automatically update on language change.',
                                        fr : 'Ajouter un texte de l\'objet de la langue dans la LI et mettre à jour automatiquement sur ​​le changement de langue.'
                                    }
                                },
                                {
                                    name:'append',
                                    type:'element',
                                    desc: {
                                        en : 'If defined the element will be appended into the LI.',
                                        fr : 'Si défini l\'élément sera ajouté dans la LI.'
                                    }
                                },
                            ]
                        },
                        {
                            type:'number',
                            attributes:[{
                                name:'shift',
                                desc: {
                                    en : 'If supplied the value will be appended to the LI.className.',
                                    fr : 'Si la valeur fournie sera ajouté à la LI.className.'
                                }
                            }]
                        }
                    ]
                },
                { 
                    name:'container', 
                    type:'element',
                    desc : {
                        en : 'The UL element that contains the LI siblings.',
                        fr : 'L\'élément UL qui contient les frères et sœurs LI.'
                    }
                },
                { 
                    name:'pool', 
                    type:'array',
                    desc : {
                        en : 'The list in its ordered state.',
                        fr : 'La liste dans son état ​​ordonné.'
                    }
                },
                { 
                    name:'remove', 
                    type:'function',
                    desc : {
                        en : 'Passing an object in the list will remove it.',
                        fr : 'Le passage d\'un objet dans la liste retirer.'
                    }
                },
                { 
                    name:'shift', 
                    type:'function',
                    desc : {
                        en : 'Moves an object in the list by a number of places.',
                        fr : 'Déplace un objet dans la liste d\'un certain nombre d\'endroits.'
                    },
                    attributes:[
                        {
                            type:'object',
                            required:true,
                            attributes:[{
                                desc: {
                                    en : 'The object in the list to move.',
                                    fr : 'L\'objet dans la liste pour se déplacer.'
                                }
                            }]
                        },
                        {
                            type:'number',
                            required:true,
                            attributes:[{
                                desc: {
                                    en : 'The number of places to move the item in the list.',
                                    fr : 'Le nombre de places pour déplacer l\'élément dans la liste.'
                                }
                            }]
                        }
                    ]
                }
            ]
        };

        model.parent.stash.childsupport(data,model);
    };
};
