window.addEvent('domready', function(){
	// First Example
	var el = $('myElement'),
		font = $('fontSize');
	
	// Create the new slider instance
	new Slider(el, el.getElement('.knob'), {
		steps: 25,	// There are 25 steps
		range: [1],	// Minimum value is 8
		onChange: function(value){
			// Everytime the value changes, we change the font of an element
			$('clickData').innerHTML = "<p>You have selected " + value + ".</p>";
	        $('timeOfEvac').value = value; 
		}
	});
});