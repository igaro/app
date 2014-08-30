module.exports = function(app) {

    return function(model) {

        var data = {
            desc : {
                en : 'Storage routines for cookie, localStorage and sessionStorage. This module is only for immediate access stores.',
                fr : 'Système de stockage pour cookie, localStorage et sessionStorage. Ce module est uniquement pour un accès immédiat magasins.'
            },
            author : { 
                name:'Andrew Charnley', 
                link:'mailto:andrew.charnley@igaro.com' 
            },
            usage : {
                class : true
            },
            attributes : [
                { 
                    name:'get', 
                    type:'function',
                    desc : {
                        en : 'Retrieves a value from a storage system.',
                        fr : 'Extrait une valeur à partir d\'un système de stockage.'
                    },
                    attributes: [
                        { 
                            type:'string', 
                            required:true,
                            attributes:[{
                                desc: {
                                    en : 'The name to match. Typically the module name.',
                                    fr : 'Le nom de match. Typiquement, le nom du module.'
                                }
                            }]
                        },
                        { 
                            type:'object', 
                            required:true,
                            attributes:[{
                                desc: {
                                    en : 'The id to match. This and the name form the queried string.',
                                    fr : 'L\'identifiant de match. Ceci et le nom forment la chaîne demandées.'
                                }
                            }]
                        },
                        { 
                            type:'object', 
                            required:true,
                            attributes:[
                            	{
	                            	type:'string',
	                            	name:'type',
	                                desc: {
	                                    en : 'The storage system to use. Set to cookie, local or session. Default is local.',
	                                    fr : 'Le système de stockage à utiliser. Situé à cookie, locale ou de la session. Défaut est local.'
	                                }
                            	}
                            ]
                        }
                    ]
                },
                { 
                    name:'set', 
                    type:'function',
                    desc: {
                        en : 'Saves a value to a storage system.',
                        fr : 'Enregistre une valeur à un système de stockage.'
                    },
                    attributes: [
                        { 
                            type:'string',
                            required:true,
                            attributes:[{
                                desc: {
                                    en : 'The name to use. Typically the module name.',
                                    fr : 'Le nom à utiliser. Typiquement, le nom du module.'
                                }
                            }]
                        },
                        { 
                            type:'string',
                            required:true,
                            attributes:[{
                                desc: {
                                    en : 'The id to use. This and the name form a unique reference.',
                                    fr : 'L\'identifiant à utiliser. Ceci et le nom forment une référence unique.'
                                }
                            }]
                        },
                        { 
                            type:'*',
                            attributes:[{
                                desc: {
                                    en : 'The value to store. Undefined removes the record.',
                                    fr : 'La valeur à stocker. Undefined supprime l\'enregistrement.'
                                }
                            }]
                        },
                        { 
                            type:'object',
                            required:false,
                            attributes:[
                            	{
	                            	type:'string',
	                            	name:'type',
	                                desc: {
	                                    en : 'Set to cookie, local or session. Default is local.',
	                                    fr : 'Situé à cookie, locale ou de la session. Défaut est local.'
	                                }
                            	}
                            ]
                        },
                    ]
                }
            ]
        };

        model.parent.store.childsupport(data,model);

    };
};
