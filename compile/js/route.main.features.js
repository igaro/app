module.requires = [
    { name: 'route.main.features.css' },
    { name: 'core.language.js' },
    { name: 'core.currency.js' }
];

module.exports = function(app) {

    return function(model) {

        var view = model.view;

        var wrapper = view.wrapper;

        model.meta.set('title', {
            en : 'Features',
            fr : 'Traits'
        });

        view.createAppend('p',wrapper,{
            en : 'Igaro App comes with everything you need to make an excellent website and mobile application. It\'s easy to develop new modules, to use third party libraries and to import your previous work.',
            fr : 'Igaro App est livré avec de nombreuses fonctionnalités sur-le-boîte, peut-être tout ce que vous avez besoin de faire un excellent site Web et applications mobiles. Il est facile de développer de nouveaux modules, d\'inclure d\'autres javascript et css, et d\'importer votre travail précédent.'
        });

        view.createAppend('p',wrapper,{
            en : 'Below is a selection of modules from the base repetiore.',
            fr : 'Voici une sélection de modules de la repetiore de base.'
        });

        view.createAppend('h1',wrapper,'instance.samespace');

        var d = view.createAppend('p',wrapper,{
            en : 'This module displays an array of HTML elements using CSS3 effects.',
            fr : 'Ce module affiche un ensemble d\'éléments HTML en utilisant des effets CSS3.'
        });

        view.instances.add(
            {
                name:'samespace',
                insertAfter:d
            },
            {
                elements:new Array(null,null,null),
                effect:'fade'
            }
        );

        view.createAppend('h1',wrapper,'instance.xhr');

        view.createAppend('p',wrapper,{
            en : 'This example contacts the Youtube API which returns JSON. It\'s then parsed and from it three Justin Bieber videos are loaded. Enjoy!',
            fr : 'Cet exemple en contact avec l\'API Youtube qui renvoie JSON. Il est ensuite analysé et de lui trois vidéos de Justin Bieber sont chargés. Profitez!'
        });

        view.createAppend('input[button]',wrapper,{
            en : 'Execute',
            fr : 'Exécuter'
        }).addEventListener('click', function() {
            var self = this;
            view.instances.add('xhr').then(function (xhr) {
                return xhr.get({
                    res:'http://gdata.youtube.com/feeds/users/JustinBieberVEVO/uploads?alt=json&format=5&max-results=3'
                })
            }).then(
                function(data) {
                    var playlist = data.feed.entry.map(function(o) { return o.id.$t.substring(38) });
                    var f = view.createAppend('iframe',null,null,'youtube');
                    wrapper.insertBefore(f,self);
                    wrapper.removeChild(self);
                    f.src = 'http://www.youtube.com/embed/'+playlist[0]+'?wmode=transparent&amp;HD=1&amp;rel=0&amp;showinfo=1&amp;controls=1&amp;autoplay=0;playlist='+playlist.slice(1).join(',');
                }
            ).catch(function() { self.disabled = false; });
            self.disabled = true;
        });

        view.createAppend('h1',wrapper,'instance.form.validate');

        view.createAppend('p',wrapper,{
            en : 'Try entering an invalid currency denomination into the box below.',
            fr : 'Essayez d\'entrer une valeur nominale de monnaie non valide dans la case ci-dessous.'
        });

        var f = view.createAppend('form',wrapper,null,'currencycheck');
        view.createAppend('label',f,{
            en : 'Deposit',
            fr : 'Dépôt'
        });
        var v = view.createAppend('input[text]',f);
        v.placeholder='xx.xx';
        var b = view.createAppend('button',f,{
            en : 'Transfer',
            fr : 'Transfert'
        });
        b.disabled=true;
        var ccp;
        view.instances.add('form.validate',{
            form:f,
            routine: function() {
                if (ccp) ccp = view.instances.remove(ccp);
                b.disabled = true;
                var vg = v.value.trim();
                if (! vg.length) return { near:v, message: {
                    en: 'A value is required',
                    fr: 'Une valeur est requise'
                }};
                if (! app['core.currency'].validate(vg)) return { near:v, message: {
                    en:'Invalid amount',
                    fr:'Montant invalide'
                }};
                b.disabled = false;
            }
        });
        b.addEventListener('click',function() {
            this.disabled = true;
            if (ccp) ccp = view.instances.remove(ccp);
            v.value='';
            view.instances.add('pagemessage',{ 
                type:'ok',
                message: {
                    en : 'The virtual transaction was successful.',
                    fr : 'L\'opération a été un succès virtuel.'
                }
            }).then(function(cp) {
                ccp=cp;
                f.insertBefore(ccp.container,f.firstChild);
            })
            
        });

        view.createAppend('h1',wrapper,'instance.rte');

        view.createAppend('p',wrapper);

        view.instances.add('rte',{ container:wrapper });

    };

};
