/* Convert Javascript to a numbered, embeddable HTML table
  David Weinberger
  self@evident.com
  
  Purely amateur effort.
  Available under open license at Github: 
  https://github.com/dweinberger/convertJStoTable
*/
// Global array of chosen colors

var colors = {
            rowbkgrd: "#FFF6A6",
            rowfont: "#05007E",
            numberbkgrd: "#355DB2",
            numberfont: "#FFFFFF",
            comment : "#A1A1A1"
        }
// default colors
var growbkgrd = "#FFF6A6";
var growfont = "#05007E";
var gnumberbkgrd = "#355DB2";
var gnumberfont ="#FFFFFF";
var gcomment = "#A1A1A1";

//----------------- INIT
function init(){
// get textarea to accept tab key
// thank you http://stackoverflow.com/questions/6140632/how-to-handle-tab-in-textarea
	$("#rawjs").keydown(function(e) {
		if(e.keyCode === 9) { // tab was pressed
			// get caret position/selection
			var start = this.selectionStart;
			var end = this.selectionEnd;

			var $this = $(this);
			var value = $this.val();

			// set textarea value to: text before caret + tab + text after caret
			$this.val(value.substring(0, start)
						+ "\t"
						+ value.substring(end));

			// put caret at right position again (add one for the tab)
			this.selectionStart = this.selectionEnd = start + 1;

			// prevent the focus lose
			e.preventDefault();
		}
	});
	
	// get cookies for colors
	var cook;
	cook = getCookie("numberfont"); // number font color
	if (cook){
		colors["numberfont"] = cook; 
		$(".numbcell").css("color",cook);
		setDemoTableColor(".numbcell","FOREGROUND",cook); // alter demo table
	}
	cook = getCookie("numberbkgrd"); // number background
	if (cook){
		colors["numberbkgrd"] = cook; 
		$(".numbcell").css("background-color",cook);
		setDemoTableColor(".numbcell","BACKGROUND",cook);
	}
	cook = getCookie("rowfont"); // main font color
	if (cook){
		colors["rowfont"] = cook; 
		$(".cellp").css("color",cook);
		setDemoTableColor(".cellp","FOREGROUND",cook); // alter demo table
	}
	cook = getCookie("rowbkgrd"); // main background
	if (cook){
		colors["rowbkgrd"] = cook; 
		$(".cell").css("background-color",cook);
		setDemoTableColor(".cell","BACKGROUND",cook); // alter demo table
	}
	cook = getCookie("comment"); // comment
	if (cook){
		colors["comment"] = cook; 
		setDemoTableColor(".comment","FOREGROUND",cook);
	}
	
	// color picker 
	// thank you http://bgrins.github.io/spectrum/
	$("#colorpickinput").spectrum({
    color: "#f00",
    showInput: false,
    flat: true,
    showPalette:true,
    palette: [
        ['#355DB2', '#05007E', '#FFF6A6'],
        ['black', 'white', 'red'],
        ['green', 'blue', 'violet'],
        ['yellow','brown','gray'] 
    	],
    change: function(color) {
    	// delete any existing markup
    	$("#prediv").html();
    	// set the color
       	setColor(color);
        }
	});	
}

// --------------- SET THE COLOR
function setColor(color){

	// get the current chosen color
	var col = $("#colorpickinput").spectrum("get");
	var colstring = col.toHexString();
	  
	  // which radio button is selected?
	  var whichbtn = $('input:radio[name=colors]:checked').val();
	  	// main row background
    	if (whichbtn == "coderowbkgrd"){
       		$(".cell").css("background-color",colstring);
       		colors["rowbkgrd"] = colstring; // set global
       		setDemoTableColor(".cell","BACKGROUND",colstring); // alter demo table
    		setCookie("rowbkgrd",colstring);
    	}
    	// main row font color
    	if (whichbtn == "coderowfont"){
       		$(".cellp").css("color",colstring);
       		colors["rowfont"] = colstring; // set global
       		setDemoTableColor(".cellp","FOREGROUND",colstring); // alter demo table
       		setCookie("rowfont",colstring);
    	}
    	// number font color
    	if (whichbtn == "numberfont"){
       		$(".numbcell").css("color",colstring);
       		colors["numberfont"] = colstring; // set global
       		setDemoTableColor(".numbcell","FOREGROUND",colstring); // alter demo table
    		setCookie("numberfont",colstring);
    	}
    	// number background
    	if (whichbtn == "numberbkgrd"){
       		$(".numbcell").css("background-color",colstring);
       		colors["numberbkgrd"] = colstring; // set global
       		setDemoTableColor(".numbcell","BACKGROUND",colstring);
       		setCookie("numberbkgrd",colstring);
    	}
    	// comment font color
    	if (whichbtn == "comments"){
       		$(".comment").css("color",colstring);
       		colors["comment"] = colstring; // set global
       		setDemoTableColor(".comment","FOREGROUND",colstring); // alter demo table
    		setCookie("comment",colstring);
    	}
	
}

function setDemoTableColor(clss,which,color){
	// changes the class for the table shown as a result
	// Thank you, vsync! http://stackoverflow.com/questions/1679577/get-document-stylesheets-by-name-instead-of-index
	
    var ss = document.styleSheets[0]; // gets first. Second is spectrum's.
    var rules = ss.cssRules || ss.rules;
    var classRule = null;
    for (var i = 0; i < rules.length; i++) {
        var rule = rules[i];
       // if (/(^|,) *numbcell *(,|$)/i.test(rule.selectorText)) {
       if (rule.selectorText == clss){
            classRule = rule;
            break;
        }
    }
    if (which == "FOREGROUND"){
    	classRule.style.color = color;
	}
	else {
		classRule.style.backgroundColor = color;
	}
 return
}

function restoreDefaultColors(){
	// 1. update the array of colors
	// 2. update the demo table display
	// 3. update the one line demo
	// 4. set cookies
	
	// number font
	colors["numberfont"] = gnumberfont; // set global
    setDemoTableColor(".numbcell","FOREGROUND",gnumberfont); // alter demo table
	$(".numbcell").css("color",gnumberfont); // change the one line demo
	setCookie("numberfont",gnumberfont);
	// number background
	colors["numberbkgrd"] = gnumberbkgrd; // set global
    setDemoTableColor(".numbcell","BACKGROUND",gnumberbkgrd); // alter demo table
	$(".numbcell").css("background-color",gnumberbkgrd);
	setCookie("numberbkgrd",gnumberbkgrd);
	// main row font color
	colors["rowfont"] = growfont; // set global
    setDemoTableColor(".cellp","FOREGROUND",growfont); // alter demo table
	$(".cellp").css("color",growfont);
	setCookie("rowfont",growfont);
	// main row background
	colors["rowbkgrd"] = growbkgrd; // set global
    setDemoTableColor(".cell","BACKGROUND",growbkgrd); // alter demo table
	$(".cell").css("background-color",growbkgrd);
	setCookie("rowbkgrd",growbkgrd);
	// comment font color
	colors["comment"] = gcomment; // set global
    setDemoTableColor(".comment","FOREGROUND",gcomment); // alter demo table
	$(".comment").css("color",gcomment);
	setCookie("comment",gcomment);
}

function setCookie(cookieName,cookieValue) {
	 var today = new Date();
	 var expire = new Date();
	 var nDays = 1700; // about 5 yrs
	 expire.setTime(today.getTime() + 3600000*24*nDays);
	 document.cookie = cookieName+"="+escape(cookieValue) + ";expires="+expire.toGMTString();
}
function getCookie(c_name)
{
	 var i,x,y,ARRcookies=document.cookie.split(";");
	 for (i=0;i<ARRcookies.length;i++)
	 {
	   x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
	   y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
	   x=x.replace(/^\s+|\s+$/g,"");
	   if (x==c_name)
		 {
		 return unescape(y);
		 }
	   }
}

function countInitialCharacters(s,c){
	// this was originally going to count tabs or spaces.
	// now: just tabs
	var done= false, i = 0, ct = 0, c1 = "";
		while (done == false){
		c1 = s.substr(i,1);
		if (c1 == c){
			ct++;
		}
		else {
			done = true;
		}
		i++;
		if (i == s.length){
			done = true;
		}
	}
	return ct;
}


function convertJS(){

	// get the code to convert
	var js = $("#rawjs").val();
	var sarray = js.split("\n"); // turn into an array of lines

	// build the table displaying the code
	var ctr = 1;
	var tbl = document.createElement("table");
	tbl.setAttribute("class","codetable");
	var tbody = document.createElement("tbody");
	tbl.appendChild(tbody);
	for (i=0; i < sarray.length; i++){
		var row = document.createElement("tr");
		row.setAttribute("class","row");
		// -- create number cell
		var cell = document.createElement("td");
		cell.setAttribute("class","numbcell");
		var trimmedline = $.trim(sarray[i]);
		if (trimmedline !== ""){
			$(cell).text(ctr);
			ctr++;
		}
		else {
			$(cell).html("&nbsp;");
		}
		row.appendChild(cell);
	
		// -- Create cell with content of one line
		var cell = document.createElement("td");
		cell.setAttribute("class","cell");
		var p = document.createElement("p");
		p.setAttribute("class","cellp");
		// convert 4 spaces to an indent
		sarray[i] = sarray[i].replace(/    /g, '\t');
		// get number of indents
		var indents = countInitialCharacters(sarray[i],"\t")
		var leftmarg = (indents * 30) + "px";
		$(p).css("margin-left", leftmarg);
		var lineOfCode = sarray[i];
		lineOfCode = lineOfCode.replace(/\&/g, '&amp;');
		lineOfCode = lineOfCode.replace(/\</g, '&lt;');
    	lineOfCode = lineOfCode.replace(/\>/g, '&gt;');
		// markup the comments
		var commentbegins = lineOfCode.indexOf("//");
		if (commentbegins > -1){
			var comment = lineOfCode.substr(commentbegins);
			lineOfCode = lineOfCode.substr(0, commentbegins) + "<span class='comment'>" + comment + "</span>";
		}
		$(p).html(lineOfCode);
		cell.appendChild(p);
		row.appendChild(cell);
		tbody.appendChild(row);	
		}

	// -- insert the completed table
	var resultsdiv = document.getElementById("resultsdiv");
	resultsdiv.innerHTML = ""; // clear out the old
	resultsdiv.appendChild(tbl);

	// create toggle button
	var but = document.createElement("input");
	but.setAttribute("type","button");
	but.setAttribute("value","Toggle line numbers");
	
	
	but.setAttribute("onclick","$(this).parent().parent().find('.numbcell').toggle(300)");
	resultsdiv.appendChild(but);
   
   	// display it by turning markup into html entities
   	$("#copyinstruction").show(300); // show the copy instructions
   	var resultshtml = $(resultsdiv).html();
   	// wrap it in a div so we can find the numbcells to toggle
   	resultshtml = "<div>" + resultshtml + "</div>";
   	// preface it with jquery load statment
   	resultshtml = "<script src='//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js'></script>" + resultshtml; 
    resultshtml = resultshtml.replace(/\&/g, '&amp;');
	resultshtml = resultshtml.replace(/\</g, '&lt;');
    resultshtml = resultshtml.replace(/\>/g, '&gt;');
    
		var x = "<span>test</span>";
 	// add a style section
 	var style= "&lt;style&gt;.row{border: 1px solid blue; "
 	+ "padding: 0px;margin-top: 0px;margin-bottom: :0px;;}.numbcell{background-color:"
 	+ colors["numberbkgrd"] 
 	+ ";color: " + colors["numberfont"] + ";text-align: right;font-family: 'Helvetica Neue', Helvetica, Arial, Verdana;}"
 	+ ".cell{padding:0px;background-color: " + colors["rowbkgrd"] + ";}"
 	+".cellp{line-height: 110%;color: " + colors["rowfont"] 
 	+ ";padding: 0px;margin-top:0px;margin-bottom: 0px;font-family: Courier, 'Courier New';}"
 	+ ".comment{color:" + colors["comment"] + ";}&lt;/style&gt;";
 	
 	resultshtml = style + resultshtml;
  
   $("#prediv").html(resultshtml);
   
    // select the text
    // thank you: http://stackoverflow.com/questions/18611992/selected-text-inside-div
    var doc = document
        , text = document.getElementById("prediv")
        , range, selection
    ;    
    if (doc.body.createTextRange) { //ms
        range = doc.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } else if (window.getSelection) { //all others
        selection = window.getSelection();        
        range = doc.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

function loadDemo(){
	// get demo text
	var demo = $("#demotext").text();
	$("#rawjs").val(demo);
}
