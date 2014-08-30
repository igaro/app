module.exports = function(app) {

    return function(model) {

        var data = {
            desc : {
                en : 'Provides file related functionality and formatting.',
                fr : 'Fournit des fonctionnalités de fichiers liés et mise en forme.'
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
                    name:'getExtension',
                    type:'function',
                    attributes: [
                        { 
                            type:'string', 
                            required:true, 
                            attributes : [{
                                desc: {
                                    en : 'The filename to process.',
                                    fr : 'Le nom du fichier à traiter.'
                                }
                            }]
                        }
                    ],
                    desc: {
                        en : 'Returns a filename extension.',
                        fr : 'Retourne une extension de nom de fichier.'
                    }
                },
                { 
                    name:'formatSize', 
                    type:'function',
                    attributes: [
                        { 
                            type:'number', 
                            required:true,
                            attributes : [{
                                desc: {
                                    en : 'The filesize in bytes.',
                                    fr : 'La taille du fichier en octets.'
                                }
                            }]
                        }
                    ],
                    desc: {
                        en : 'Returns a string containing a formatted file size.',
                        fr : 'Retourne une chaîne contenant une taille de fichier formaté.'
                    }
                }
            ]

        };

        model.parent.store.childsupport(data,model);

    };
};