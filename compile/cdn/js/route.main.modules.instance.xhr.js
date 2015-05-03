module.exports = function(app) {

    return function(model) {

        var data = {
            desc : {
                en : 'Asynchronously fetches and returns data from a resource.',
                fr : 'Récupère de manière asynchrone et renvoie des données provenant d\'une ressource.'
            },
            author : { 
                name:'Andrew Charnley', 
                link:'http://www.igaro.com/ppl/ac' 
            },
            demo : "
var b = dom.mk('button', c, { en: 'Get JSON', fr: 'Obtenez JSON' }); \n \
b.addEventListener('click', function () { \n \
    model.managers.object.create('xhr').then(function (xhr) { \n \
        return xhr.get({ res:'http://www.igaro.com/misc/demo.json' }).then( \n \
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
                        name:'headers',
                        type:'object',
                        desc: {
                            en : 'An object literal of headers to be sent.',
                            fr : 'Un littéral d\'objet de têtes à être envoyé.'
                        }
                    },
                    { 
                        name:'form',
                        type:'element',
                        desc : {
                            en : 'Calls applyForm() directly.',
                            fr : 'Invite applyForm() directement.'
                        }
                    },
                    { 
                        name:'res', 
                        required:true, 
                        type:'string',
                        desc : {
                            en : 'The resource (i.e URL) to load.',
                            fr : 'La ressource (à savoir l\'URL) pour charger.'
                        }
                    },
                    { 
                        name:'withCredentials', 
                        type:'boolean',
                        desc : {
                            en : 'Enables CORS over XHR.',
                            fr : 'Permet CORS sur XHR.'
                        }
                    },
                    {
                        name:'vars',
                        type:'object',
                        desc: {
                            en : 'An object literal of name/value pairs to sent.',
                            fr : 'Un littéral d\'objet de paires nom / valeur à envoyer.'
                        }
                    }
                ]
            },
            attributes : [
                { 
                    name:'abort',
                    type:'function',
                    desc: {
                        en : 'Aborts the XHR operation (if it is currently running).',
                        fr : 'Annule l\'opération de XHR (si elle est en cours d\'exécution).'
                    }
                },
                { 
                    name:'applyForm', 
                    type:'function',
                    desc : {
                        en : 'Enumerates over a form and caches the values to be sent. If the XHR is resent you must re-run this to send modified form data.',
                        fr : 'Énumère sur une forme et met en cache les valeurs à être envoyés. Si la XHR est renvoyé, vous devez ré-exécuter cette fonction pour envoyer des données de formulaire modifiés.'
                    },
                    attributes : [{
                        type:'element',
                        desc : {
                            en : 'The form to send. Element values will be enumerated once allowing you to keep the same values on resend. Call again to refresh.',
                            fr : 'Le formulaire pour envoyer. Valeurs d\'élément seront énumérés fois vous permettant de garder les mêmes valeurs sur la renvoyer. Appelez à nouveau pour se rafraîchir.'
                        }
                    }]
                },
                {
                    name:'delete',
                    type:'function',
                    desc: {
                        en : 'Send a DELETE command to the server.',
                        fr : 'Envoyer une commande DELETE sur le serveur.'
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
                                en : 'Upon resolve passes the data and XHR as arguments.',
                                fr : 'Après détermination transmet les données et XHR comme arguments.'
                            }
                        }]
                    },
                },
                {
                    name:'head',
                    type:'function',
                    desc: {
                        en : 'Send a HEAD command to the server.',
                        fr : 'Envoyer une commande HEAD sur le serveur.'
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
                                en : 'Upon resolve passes the data and XHR as arguments.',
                                fr : 'Après détermination transmet les données et XHR comme arguments.'
                            }
                        }]
                    },
                },
                {
                    name:'get',
                    type:'function',
                    desc: {
                        en : 'Send a GET command to the server.',
                        fr : 'Envoyer une commande GET sur le serveur.'
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
                                en : 'Upon resolve passes the data and XHR as arguments.',
                                fr : 'Après détermination transmet les données et XHR comme arguments.'
                            }
                        }]
                    },
                },
                {
                    name:'options',
                    type:'function',
                    desc: {
                        en : 'Send an OPTIONS command to the server.',
                        fr : 'Envoyer une commande OPTIONS sur le serveur.'
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
                                en : 'Upon resolve passes the data and XHR as arguments.',
                                fr : 'Après détermination transmet les données et XHR comme arguments.'
                            }
                        }]
                    },
                },
                {
                    name:'post',
                    type:'function',
                    desc: {
                        en : 'Send a POST command to the server.',
                        fr : 'Envoyer une commande POST sur le serveur.'
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
                                en : 'Upon resolve passes the data and XHR as arguments.',
                                fr : 'Après détermination transmet les données et XHR comme arguments.'
                            }
                        }]
                    },
                },
                {
                    name:'put',
                    type:'function',
                    desc: {
                        en : 'Send a PUT command to the server.',
                        fr : 'Envoyer une commande PUT sur le serveur.'
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
                                en : 'Upon resolve passes the data and XHR as arguments.',
                                fr : 'Après détermination transmet les données et XHR comme arguments.'
                            }
                        }]
                    },
                },
                { 
                    name:'setHeader', 
                    type:'function',
                    desc : {
                        en : 'Modifies a header.'
                    },
                    attributes : [
                        {
                            type:'string',
                            attributes : [{
                                desc : {
                                    en : 'The name of a header to set.',
                                    fr : 'Le nom d\'un en-tête à régler.'
                                }
                            }]
                        },
                        {
                            type:'string',
                            attributes : [{
                                desc : {
                                    en : 'Value of the header. Null will remove any previously defined value.',
                                    fr : 'Valeur de l\'en-tête. Null supprime toute valeur précédemment définie.'
                                }
                            }]
                        }
                    ]
                },
                { 
                    name:'setVar', 
                    type:'function',
                    desc : {
                        en : 'Appends or removes (if no value) a name/value to URI encode.',
                        fr : 'Ajoute ou supprime (si aucune valeur) un nom / valeur à encoder URI.'
                    },
                    attributes : [
                        {
                            type:'string',
                            attributes : [{
                                desc : {
                                    en : 'The name to be sent.',
                                    fr : 'Le nom doit être envoyé.'
                                }
                            }]
                        },
                        {
                            type:'string',
                            attributes : [{
                                desc : {
                                    en : 'The value to be sent. Setting to null will remove any previously defined value.',
                                    fr : 'La valeur à transmettre. Réglage de nulle supprime toute valeur précédemment définie.'
                                }
                            }]
                        }
                    ]
                },
                {
                    name:'trace',
                    type:'function',
                    desc: {
                        en : 'Send a TRACE command to the server.',
                        fr : 'Envoyer une commande TRACE sur le serveur.'
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
                                en : 'Upon resolve passes the data and XHR as arguments.',
                                fr : 'Après détermination transmet les données et XHR comme arguments.'
                            }
                        }]
                    },
                },
                { 
                    name:'withCredentials', 
                    type:'boolean',
                    desc : {
                        en : 'Enable CORS over XHR. Usual browser limitations apply.',
                        fr : 'Activer CORS sur XHR. Des restrictions des navigateurs habituels s\'appliquent.'
                    }
                },
                { 
                    name:'xhr', 
                    instanceof: { name:'XMLHttpRequest' },
                    desc : {
                        en : 'A reference to the XMLHttpRequest object.',
                        fr : 'Une référence à l\'objet XMLHttpRequest.'
                    }
                }
            ],

            extlinks : [
                { 
                    name:'W3C RFC2616', 
                    href:'http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html'
                }
            ]

        };

        model.parent.stash.childsupport(data,model);

    };

};
