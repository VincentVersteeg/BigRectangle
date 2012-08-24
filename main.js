Mousetrap.bind('enter', function() { parseString(document.getElementById('bigrectangle').value); });

function parseString(pstring) {
	mixpanel.track("parsestring", {"screenheight":screen.height, "screenwidth":screen.width, "useragent": navigator.userAgent, "windowheight": $(window).height(), "windowwidth": $(window).width(), "browser": BrowserDetect.browser, "browsernum": BrowserDetect.version, "os": BrowserDetect.OS});
	currentPString = pstring;
	readFile("http://owenversteeg.github.com/BigRectangle/personality.txt", "personality");
}

var currentPString;

var x, result, xstatus, waitTime, plines;
var txtFile = new XMLHttpRequest();

function readFile(url, state) {
	txtFile['state'] = state;
	txtFile.open("GET", url, true);
	txtFile.onreadystatechange = function() {
		if (txtFile.readyState === 4) {  // Makes sure the document is ready to parse.
			if (txtFile.status === 200) {  // Makes sure it's found the file.
				var lines = txtFile.responseText.split("\n"); // Will put each line as part of an array
				
				plines = lines;
				
				for (var i=0; i<lines.length; i++) {
					lines[i] = lines[i].substring(0, lines[i].length-1);
				}
				//ALWAYS end personality file w/newline
				
				if (txtFile['state'] === "personality") {
					pLines = lines;
					result = personalityParse(lines);
					console.log(result);
					if (result == null && xstatus != "secondcheck") {
						//The personality file had nothing to say on the subject, AND the standardization file didn't already work its' magic - go to the standardization file
						readFile("http://owenversteeg.github.com/BigRectangle/standardization.txt", "standardization");
					}
					else if (result == null && xstatus == "secondcheck") {
						//The personality file had nothing to say on the subject, AND the standardization file already went - go to the data file
						//readFile("http://owenversteeg.github.com/BigRectangle/data.txt", "data");
						alert('this program is not finished');
					}
					else if (result != null || result != undefined) {
						//all good
						alert(result);
					}
				}
				
				if (txtFile['state'] === "standardization") {
					result = standardizationParse(lines); //parses the standardization file
					//now check if the personality file likes the result
					xstatus = "secondcheck";
					readFile("http://owenversteeg.github.com/BigRectangle/personality.txt", "personality");
				}
			}
		}
	}
	txtFile.send(null);
}

var i;
var input = [];
var output = [];

function standardizationParse(lines) {
	console.log('Lines: '+lines);
	//this code is golden
	/*TODO:
	parse written numbers
	write standardization file
	*/
	input = [];
	output = [];
	i = 0; //number of lines into the array
	$.each(lines, function() {  // going through the array of lines
		if (i != 0) { //if this is not the first line
			if (lines[i-1].length == 0) input.push(lines[i]); //was the previous line blank? if so, this is added to the input array.
			if (i != 1) { //if this is not the second line
				if (lines[i-2].length == 0) output.push(lines[i]); //if prev prev was blank, this is output
			}
			else {
				output.push(lines[i]);
			}
		}
		else { //else, if this is the first line, we know it's input
			input.push(lines[i]);
		}
		i++; //go to next line
	});
	
	var reezlt = null;
	
	for (var i=0; i<input.length; i++) {
		if (input[i] == currentPString) reezlt = output[i]; //rewrite so that the entire phrase need not be matched
	}

	return reezlt;
}

function personalityParse(lines) {
	console.log('Lines: '+lines);
	//This code is golden
	var rslt = null; //result
	for (var i=0; i<lines.length; i++) { //for each item in the array, execute this
		//if (lines[i].toString().indexOf('g= ') != -1 && lines[i+1].toString().indexOf('r= ') != -1) {
			if (lines[i].toString().toLowerCase() == 'g= ' + currentPString.toLowerCase().toString()) {
				rslt = lines[i+1].substr(3); //the result equals the returned value 
			}
		//}
	}
	return rslt;
}

function resizeTo() {
	var bigRect = document.getElementById('bigrectangle');
	var searchBtn = document.getElementById('endbtn');
	var searchIcon = document.getElementById('sicon');
	if (document.body.offsetWidth > 1000) {
		//enough space to have big fonts
		bigRect.setAttribute('style', 'font-size:90px !important');
		searchBtn.setAttribute('style', 'font-size:90px !important');
		searchBtn.setAttribute('style', 'height:118px !important');
		searchBtn.setAttribute('style', 'width:118px !important');
	}
	else if (document.body.offsetWidth > 400 && document.body.offsetWidth < 1000) {
		bigRect.style.cssText = bigRect.style.cssText + 'font-size:50px !important; width:'+($('#container').width()-99)+'px !important;';
		searchBtn.style.cssText = searchBtn.style.cssText + 'font-size:51px !important; line-height:53px !important; width:70px !important; height:70px !important;';
		searchIcon.style.cssText = "margin-left: 0px !important;";
	}
	else {
		bigRect.style.cssText = bigRect.style.cssText + 'font-size:25px !important; width:'+($('#container').width()-68)+'px !important;';
		searchBtn.style.cssText = searchBtn.style.cssText + 'font-size:25px !important; line-height:26px !important; width:40px !important; height:40px !important;';
		searchIcon.style.cssText = "margin-left: -4px !important;";
	}
}

$(document).ready(function() {
	resizeTo();
});

//resize the textbox on window resize
$(window).resize(function() {
  resizeTo();
});

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
			parseString(document.getElementById('bigrectangle').value);
		}
	});
});