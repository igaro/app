module.exports = function(app) {

    return function(model) {

        var data = {
            desc : {
                en : 'Moment is a date manipulation and display library. The library has been slightly modified to allow for exporting the library into the Igaro App namespace. Ideally you should access the functionality of this module through instance.date.',
                fr : 'Moment est une bibliothèque date de manipulation et d\'affichage. La bibliothèque a été légèrement modifié pour permettre l\'exportation de la bibliothèque dans l\'espace de noms Igaro App. Idéalement, vous devriez accéder à toutes les fonctionnalités de ce module par instance.date.'
            },
            usage : {
                class : true
            },
            related : [
                'instance.date'
            ],
            extlinks : [
                'http://www.momentjs.com'
            ]
        };

        model.parent.store.childsupport(data,model);

    };
};
