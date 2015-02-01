module.exports = function(app) {

    return function(model) {

        var data = {

            demo : "var f = view.createAppend('form',c), v = view.createAppend('input[text]',f); \n \
v.placeholder='Currency amount'; \n \
view.instances.add('form.validate',{ \n \
    form:f, \n \
    routine: function() { \n \
        var vg = v.value.trim(); \n \
        if (! vg.length) return { near:v, message: { \n \
            en: 'A value is required', \n \
            fr: 'Une valeur est requise' \n \
        }}; \n \
        if (! app['core.currency'].validate(vg)) return { near:v, message: { \n \
            en:'Invalid amount', \n \
            fr:'Montant invalide' \n \
        }}; \n \
    } \n \
})",
            desc : {
                en : 'Provides form validation. Note: at some point in the near future this module will change to work in a similar fashion to AngularJS form validation.',
                fr : 'Fournit la validation de formulaire. Remarque: à un certain point dans un proche avenir ce module va changer à travailler d\'une manière similaire à AngularJS validation du formulaire.'
            },
            usage : {
                instantiate : true,
                attributes : [
                    { 
                        name:'form', 
                        type:'element',
                        desc : {
                            en : 'A form element containing the inputs to validate.',
                            fr : 'Un élément de formulaire contenant les entrées pour valider.'
                        },
                        required:true
                    },
                    { 
                        name:'routine', 
                        type:'function',
                        desc : {
                            en : 'The routine to run on any form element value change.',
                            fr : 'La routine pour fonctionner sur tout changement de valeur de l\'élément de formulaire.'
                        },
                        required:true,
                        returns : {
                            attributes : [
                                {
                                    type:'element',
                                    name:'near',
                                    desc: {
                                        en : 'The element which failed validation.',
                                        fr : 'L\'élément qui a échoué validation.'
                                    }
                                },
                                {
                                    type:'object',
                                    name:'message',
                                    desc:{
                                        en : 'A message pertaining to the validation failure.',
                                        fr : 'Un message concernant l\'échec de validation.'
                                    }
                                }
                            ]
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
                    name:'init', 
                    type:'function',
                    desc : {
                        en : 'Used to register event handles onto the inputs. If your form inputs change you should re-call this.',
                        fr : 'Utilisé pour enregistrer l\'événement poignées sur les entrées. Si les entrées de votre formulaire de modification, vous devez re-appeler cela.'
                    }
                },
                { 
                    name:'routine', 
                    type:'function',
                    desc : {
                        en : 'You can update the validation routine by applying a new function to this variable.',
                        fr : 'Vous pouvez mettre à jour le programme de validation par l\'application d\'une nouvelle fonction de cette variable.'
                    }
                },
                { 
                    name:'clear', 
                    type:'function',
                    desc : {
                        en : 'Clears the form of all validation messages.',
                        fr : 'Efface la forme de tous les messages de validation.'
                    }
                }
            ]
        };

        model.parent.store.childsupport(data,model);

    };

};
