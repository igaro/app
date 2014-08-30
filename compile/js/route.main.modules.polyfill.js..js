module.requires = [
    { name:'core.language.js'}
];

module.exports = function(app) {

    return function(model) {

        var view = model.view;

        var data = {
            download : 'https://github.com/igaro/igaro/tree/master/app/compile/js',
            desc : {
                en : 'These modules prototype missing javascript functionality directly to the appropriate objects. Roughly translated, IE8 is JS 1.6 and IE9 is JS 1.85 but some obscure browsers may be classed as JS 1.81. These modules are loaded only if required.'
            },
            author : { 
                name:'Andrew Charnley', 
                link:'mailto:andrew.charnley@igaro.com' 
            }
        };

        model.parent.store.childsupport(data,model);

    };

    return true;

};
