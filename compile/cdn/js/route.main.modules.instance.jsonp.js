module.exports = function(app) {

    return function(model) {

        var data = {
            desc : {
                en : 'Asynchronously fetch JSON from a resource without hitting CORS restrictions.',
                fr : 'Récupère de façon asynchrone JSON à partir d\'une ressource sans frapper CORS restrictions.'
            },
            author : { 
                name:'Andrew Charnley', 
                link:'http://www.igaro.com/ppl/ac' 
            },
            demo : " \
var b = dom.mk('button', c, { en: 'Get JSON', fr: 'Obtenez JSON' }); \n \
b.addEventListener('click', function () { \n \
    model.managers.object.create('jsonp').then(function (jsonp) { \n \
        return jsonp.get({ res:'http://en.wikipedia.org/w/api.php?format=json&action=query&titles=India&prop=revisions&rvprop=content' }).then( \n \
            function(data) { \n \
                c.insertBefore(dom.mk('div',null,JSON.stringify(data)), b); \n \
                c.removeChild(b); \n \
            } \n \
        ); \n \
    }); \n \
}); \n \
",
            usage : {
                instantiate : true,
                attributes : [
                    { 
                        name:'callbackName', 
                        required:false, 
                        type:'string',
                        desc : {
                            en : 'For when the resource requires a callback name other than callback.',
                            fr : 'Car, lorsque la resource nécessite un nom de rappel autre que rappel.'
                        }
                    },
                    { 
                        name:'res', 
                        required:true, 
                        type:'string',
                        desc : {
                            en : 'The resource (i.e URL) to load.',
                            fr : 'La resource (à savoir l\'URL) pour charger.'
                        }
                    }
                ]
            },
            attributes : [
                { 
                    name:'abort',
                    type:'function',
                    desc: {
                        en : 'Aborts the operation (if it is currently running).',
                        fr : 'Annule l\'opération (si elle est en cours d\'exécution).'
                    }
                },
                {
                    name:'get',
                    type:'function',
                    desc: {
                        en : 'Begins the request.',
                        fr : ''
                    },
                    attributes : [{
                        type:'object',
                        attributes : [{
                            desc: {
                                en : 'Any of the instantiated data can be set here to update the XHR before it is sent.',
                                fr : 'Aucune des données instanciées peut être réglé ici pour mettre à jour le XHR avant d\'être envoyé.'
                            }
                        }]
                    }],
                    returns : {
                        attributes : [{
                            instanceof: { name: 'Promise' },
                            desc : {
                                en : 'Upon resolve passes the data back.',
                                fr : 'Après détermination transmet les données.'
                            }
                        }]
                    },
                },
            ],

            extlinks : [
                { 
                    name:'JSONP @ Wikipedia', 
                    href:'http://en.wikipedia.org/wiki/JSONP'
                }
            ]

        };

        model.parent.stash.childsupport(data,model);

    };

};
