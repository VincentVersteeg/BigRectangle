Mousetrap.bind('enter', function() { alert(parseString(document.getElementById('bigrectangle').value)) });

function parseString(pstring) {
	pstring.replace('days from now', '+d');
	pstring.replace('now', 'today');
	var date = Date.parse(pstring);
	return date;
}

$(document).ready(function() {
    $("#bigrectangle").keyup(function(event){
		if(event.keyCode == 13) {
			alert(parseString(document.getElementById('bigrectangle').value));
		}
	});
});
