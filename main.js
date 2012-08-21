Mousetrap.bind('enter', function() { alert(parseString(document.getElementById('bigrectangle').value)) });

function parseString(pstring) {
	mixpanel.track("parsestring", {"screenheight":screen.height, "screenwidth":screen.width, "useragent": navigator.userAgent, "windowheight": $(window).height(), "windowwidth": $(window).width(), "browser": BrowserDetect.browser, "browsernum": BrowserDetect.version, "os": BrowserDetect.OS});
	state = "personality";
	readFile("http://owenversteeg.github.com/BigRectangle/personality.txt");
	
	while (status != "go") {
		setTimeout(checkLaunch(),100);
	}
	return result;
}

function checkLaunch() { 
	if (status != "go") {
		//no go, delay launch
		checkLaunch();
	}
	else {
		//go for launch
		status = "go";
	}
}

var state, result, waitTime;
var txtFile = new XMLHttpRequest();

function readFile(url) {
	txtFile.open("GET", url, true);
	txtFile.onreadystatechange = function() {
		if (txtFile.readyState === 4) {  // Makes sure the document is ready to parse.
			if (txtFile.status === 200) {  // Makes sure it's found the file.
				//allText = txtFile.responseText; all the response text
				var lines = txtFile.responseText.split("\n"); // Will separate each line into an array
				if (state === "personality") result = personalityParse(lines);
				status = "go";
			}
		}
	}
	txtFile.send(null);
}

function personalityParse(lines) {
	var rslt;
	for(var i=0; i<lines.length; i++) {
		if (lines[i].toString().indexOf('g= ') != -1 && lines[i+1].toString().indexOf('r= ') != -1) {
			rslt = lines[i+1].substr(3);
		}
	}
	return rslt;
}

// You can extend the parser by adding a new parsing function to the `XDate.parsers` array.
// This function is given a single string argument and should return an XDate if parsing was successful.

function parseMDY(str) {
	// this example parses dates like "month/date/year"
	var parts = str.split('/');
	if (parts.length == 3) {
		return new XDate(
			parseInt(parts[2]), // year
			parseInt(parts[0] ? parts[0]-1 : 0), // month
			parseInt(parts[1]) // date
		);
	}
}

XDate.parsers.push(parseMDY);

var d = new XDate("6/8/1986");

var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera",
			versionSearch: "Version"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			   string: navigator.userAgent,
			   subString: "iPhone",
			   identity: "iPhone/iPod"
	    },
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};
BrowserDetect.init();

$(document).ready(function() {
	mixpanel.track("PageLoad", {"screenheight":screen.height, "screenwidth":screen.width, "useragent": navigator.userAgent, "windowheight": $(window).height(), "windowwidth": $(window).width(), "browser": BrowserDetect.browser, "browsernum": BrowserDetect.version, "os": BrowserDetect.OS});
    $("#bigrectangle").keyup(function(event){
		if(event.keyCode == 13) {
			alert(parseString(document.getElementById('bigrectangle').value));
		}
	});
});