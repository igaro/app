module.requires = [
    { name:'route.footer.css' }
];

module.exports = function(app) {

    return function(model) {

    	var view = model.view;

    	view.createAppend('div',view.wrapper,null,'navTop').addEventListener('click', function() {
    		document.body.scrollTop = document.documentElement.scrollTop = 0;

    	});

    };

};