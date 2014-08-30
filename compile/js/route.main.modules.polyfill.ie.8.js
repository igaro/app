module.requires = [
    { name:'core.language.js'}
];

module.exports = function(app) {

    return function(model) {

        var view = model.view;

        var data = {

            desc : {
                en : 'This library prototypes missing IE8 functionality, however due to deficiencies with this and IE9 (CORS/CSS3), both are unsupported by Igaro App and won\'t work out the box.'
            },
            author : { 
                name:'Andrew Charnley', 
                link:'mailto:andrew.charnley@igaro.com' 
            }
        };

        model.parent.store.childsupport(data,model);

    };

};
