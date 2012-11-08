
var unisys_parser = function(filepath, starttime, endtime, target_div)
{
	var req = new Request({
		url: filepath,
//		method: 'get',
		onComplete: function(response) { 

			var results = [];

			// Parse unisys
			var lines = response.split('\n');

			var last = [-1,-1];
			for(var l=3; l < lines.length-1; l+=1)
			{
				// Turn all large white spaces into single spaces
				lines[l] = lines[l].replace( /^\s+|\s+$/g ,'').replace( /\s+/g,' ');
				
				// And split into an array of tokens
				var k = lines[l].split(' ');
				
				if(last[0] == -1)
				{
					last[0] = k[1];
					last[1] = k[2];
				} 

				// Results start on third line
				results[l-3] = [ (1.0*(l-3)) / lines.length, parseFloat(last[1]), parseFloat(last[0]), parseFloat(k[2]), parseFloat(k[1]) ];

				last[0] = k[1];
				last[1] = k[2];
			}

	//		alert(results.length);
	//		alert(results[0]);

			//Insert the points into the map's point list.
			$(target_div).classpointer.path_points = results;

		},
	}).send();

}
