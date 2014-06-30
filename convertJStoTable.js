
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
	var sarray = js.split("\n");

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
	but.setAttribute("onclick","$('.numbcell').toggle(300)");
	resultsdiv.appendChild(but);
   
   	// display it as pre
   	$("#copyinstruction").show(300); // show the copy instructions
   	var resultshtml = $(resultsdiv).html();
   	resultshtml = resultshtml.replace(/\&/g, '&amp;');
	resultshtml = resultshtml.replace(/\</g, '&lt;');
    resultshtml = resultshtml.replace(/\>/g, '&gt;');
   	resultshtml = "<pre>" + resultshtml + "</pre>";
   	
  
   $("#prediv").html(resultshtml);
}