// Acordian Effect
function doAccordions() {
	
	//create our Accordion instance
	var myAccordion = new Fx.Accordion($('accordion'), 'h3.toggler', 'div.element', {
	//var myAccordion = new Accordion($('accordion'), '#accordion div h3.toggler', '#accordion div div.element', {
                alwaysHide : true,
		opacity: false,
		onActive: function(toggler, element){
			toggler.setStyle('color', '#1464DE');
		},
		onBackground: function(toggler, element){
			toggler.setStyle('color', '#28CE0A');
		}
	});
};

//window.addEvent('domready', doAccordions );
