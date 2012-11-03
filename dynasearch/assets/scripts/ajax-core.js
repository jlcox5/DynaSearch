
// Global Object. Yes, careful.
var AJAXCore = new Object();

AJAXCore.get_image = function(fileurl, e) {
	// Get the image
	var req = new Request({
		url:fileurl,
		onSuccess: function(html) {
			e = innerHTML;
		},
	});
	req.send();

};

