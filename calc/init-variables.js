// ==================================================================
// breakdown.js

var breakCipher = "English Ordinal" // current cipher for breakdown
var bgCol = "var(--breakdown-bg-accent)" // breakdown table background color
var chLimit = 30 // character limit, used to switch to a long breakdown style
var maxRowWidth = 36 // one row character limit (long breakdown)

$(document).ready(function(){
	// update breakdown on mouse enter/leave/click events
	$("body").on("mouseenter", ".phraseGemCiphName", function () {
		updateWordBreakdown($(this).text(), false);
	});
	$("body").on("mouseleave", ".phraseGemCiphName", function () {
		updateWordBreakdown();
	});
	$("body").on("click", ".phraseGemCiphName", function () {
		updateWordBreakdown($(this).text(), true);
	});
});

// ==================================================================
// coderain.js

var code_rain; // var to clear interval
var height_html, canvas, ctx
var w, h, ypos

// ==================================================================
// database.js

var pArr = [] // used to match numerical values
var mArr = [] // phrases returned by the match function
var gemArr = [] // phrase values for enabled ciphers
var gemArrCiph = [] // enabled ciphers indices
var numericalMode // boolean flag, match numbers instead of phrase gematria
var wheelDBactive = false // check is matched ciphers have wheel ciphers to control table width

var userDB = [] // imported database
// var userDBlive = [] // imported live database (phrases only) - declared inside calc.js
var queryResult = [] // matching phrases
var queryResultInitial = [] // matching phrases (used to reset search bar results)
var precalcDBLoaded = false // if precalculated database is loaded, disable cipher rearrangement
var searchBarValue = '' // search bar value

$(document).ready(function(){
	// Scroll inside table
	$("body").on("wheel", "#QueryTable", function (event) {

		hideContextMenu(); // close context menu on scroll
		
		st = $("#QueryTable").data("startpos")
		n = $("#QueryTable").data("dispitems")

		if (event.originalEvent.deltaY < 0) { // down -100, up 100
			if (st-dbScrollItems >= 0) {
				$("#queryArea").html() // clear previous table
				updateDatabaseQueryTable(st-dbScrollItems, n) // redraw table at new position
			}
		} else { // scroll up
			if (st+dbPageItems < queryResult.length) {
				$("#queryArea").html() // clear previous table
				updateDatabaseQueryTable(st+dbScrollItems, n) // redraw table at new position
			}
		}
	});

	// Up and Down arrow keys, List table
	$("body").on("keydown", "#queryPosInput", function (e) {
		// step="'+dbPageItems+'" min="0" max="'+queryResult.length+'"
		if (e.which == 38) queryShowPrevPage() // Up
		if (e.which == 40) queryShowNextPage() // Down
	});

	// Enter query starting position
	$("body").on("change", "#queryPosInput", function () {
		st = Number( $(this).val().replace(/[^\d]/g, '') ) // remove anything that is not a digit
		if ( isNaN(st) ) return // non numerical input
		if (st < 0) {
			st = 0
			$(this).val(0)
		} else if (st >= queryResult.length) {
			st = queryResult.length - (queryResult.length % dbPageItems) // last page
			if (queryResult.length % dbPageItems == 0) st -= dbPageItems // if total is divisible, no pagination for last element
			$(this).val(st);
		}
		n = $("#QueryTable").data("dispitems")
		$("#queryArea").html() // clear previous table
		updateDatabaseQueryTable(st, n) // redraw table at new position
	});

	// Change of scrollbar position
	$("body").on("input", "#queryScrollbar", function () {
		st = $(this).val() * dbPageItems
		n = $("#QueryTable").data("dispitems")
		$("#queryArea").html() // clear previous table
		updateDatabaseQueryTable(st, n, true) // update only the table at new position
	});
	$("body").on("change", "#queryScrollbar", function () {
		if (navigator.maxTouchPoints <= 1) document.getElementById("queryPosInput").focus() // restore focus on desktop devices after using scrollbar
	});

	// Search bar
	$("body").on("keydown", "#querySearchInput", function () {
		if ( event.which == 46 ) { // "Delete" - clear box
			searchBarDBQuery('');
			return;
		}
		if ( event.which == 13 ) { // "Enter" - search
			searchBarDBQuery($(this).val());
		}
	});

	// Click on minimize button
	$("body").on("click", "#queryMinBtn", function () {
		$("#queryArea").toggleClass("minimizeQuery")
	});
});

// ==================================================================
// date-calc.js

$(document).ready(function(){
	$("body").on("input", ".dateInput, .dateInputYear", function () {
		// id = $(this).attr('id');
		// val = $(this).val();
		// console.log('id:'+id+' value:'+val);
		offsetYMWD = [0,0,0,0] // reset offset controls
		$('#offsetY').val(0)
		$('#offsetM').val(0)
		$('#offsetW').val(0)
		$('#offsetD').val(0)
		endChkEnabled = true // allow to toggle checkbox
		$('#chkbox_incEndDate').prop("disabled", "")
		$('#chkbox_excStartDate').prop("disabled", "")
		if ( $(this).val().length > 0 ) updDates(false, $(this).attr('class')); // if input not empty
	});
	$("body").on("input", ".offsetDateInput", function () { // if input from add/subtract controls
		offY = Number( $('#offsetY').val() );
		offM = Number( $('#offsetM').val() );
		offW = Number( $('#offsetW').val() );
		offD = Number( $('#offsetD').val() );
		offsetYMWD[0] = offY; // store offset values
		offsetYMWD[1] = offM;
		offsetYMWD[2] = offW;
		offsetYMWD[3] = offD;
		// calculate offset from date 1, years and months first
		saved_d2 = new Date( saved_d1.getFullYear() + offY, saved_d1.getMonth() + offM, saved_d1.getDate());
		if (saved_d2.getDate() !== saved_d1.getDate()) {
			// if January 31st translated to March 3/2, subtract date from itself (3-3 or 2-2) to get February 28/29
			saved_d2 = new Date(saved_d2.getFullYear(), saved_d2.getMonth(), saved_d2.getDate() - saved_d2.getDate())
		}
		// calculate offset for weeks and days
		saved_d2 = new Date( saved_d2.getFullYear(), saved_d2.getMonth(), saved_d2.getDate() + (offW*7) + offD );

		endDate = 0 // exclude end date from calculation (makes no sense for offset mode)
		$('#chkbox_incEndDate').prop("checked", "") // uncheck box
		$('#chkbox_excStartDate').prop("checked", "") // uncheck box
		endChkEnabled = false // don't allow to toggle checkbox
		$('#chkbox_incEndDate').prop("disabled", "disabled")
		$('#chkbox_excStartDate').prop("disabled", "disabled")

		updDates(true); // date offset mode
	});
	$("body").on("click", ".dateDurLine", function () { // left click - toggle highlight
		$(this).toggleClass('highlightDurLine');
	});
	$("body").on("contextmenu", ".dateDurLine", function () { // right click - remove line
		$(this).parent().remove();
		return false; // don't show menus
	});
	$("body").on("input", "#dateDesc1, #dateDesc2", function () { // store user date descriptions
		dateDesc1Saved = document.getElementById("dateDesc1").value
		dateDesc2Saved = document.getElementById("dateDesc2").value
	});
});

var saved_d1 = new Date() // initial value - current system time (today)
var saved_d2 = new Date(saved_d1) // initial value

var reset_d1 = new Date(saved_d1) // values for date reset
var reset_d2 = new Date(saved_d2)

var dateDesc1Saved = "From" // date descriptions
var dateDesc2Saved = "to"

var offsetYMWD = [0,0,0,0] // store values for date offset controls

var endDate = 0 // set to 1 to include end date, -1 to exclude start date
var endChkEnabled = true // can checkbox be toggled or not

// ==================================================================
// edit-ciphers.js

var ignoreDiarciticsCustom = true // diacritical marks flag for custom cipher
var caseSensitiveCustom = false // case sensitivity flag for custom cipher
var multiCharacterCustom = false // multi character (syllable) flag for custom cipher
var wheelCipherCustom = false // wheel cipher flag for custom cipher

$(document).ready(function(){
	// click on cipher name in enabled ciphers table to load existing cipher
	$("body").on("click", ".phraseGemCiphName", function () {
		loadEditorExistingCipherValues($(this).text());
	});
});

// ==================================================================
// export-csv.js

var dragCounter = 0 // Firefox drag over style fix
$(document).ready(function(){
	// change element style on drag-enter event
	$("body").on("dragenter", "#phraseBox", function () {
		dragCounter++
		$(this).addClass("dragOver");
	});
	$("body").on("dragleave", "#phraseBox", function () {
		dragCounter--
		if (dragCounter == 0) $(this).removeClass("dragOver");
	});
});

// ==================================================================
// export.js

$(document).ready(function(){

	$("body").on("click", "#btn-print-cipher-png", function () { // for future elements
		// English-Ordinal_cipher.png
		var fileName = breakCipher.replace(/ /g, "-")+"_cipher.png";
		openImageWindow("#ChartSpot", fileName, optImageScale);
	});

	$("body").on("click", "#btn-print-history-png", function () {
		// phrase-with-spaces_2021-03-26_10-23-52_table.png
		var fileName = sHistory[0].normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/ /g, "-").replace(/["|']/g, "")+
			"_"+getTimestamp()+"_table.png";
		openImageWindow(".HistoryTable", fileName, optImageScale);
	});
	$("body").on("click", "#btn-date-calc-png", function () {
		$('#dateDesc1Area').html('<span class="dateDescription">'+dateDesc1Saved+'</span>') // input to fixed text
		$('#dateDesc2Area').html('<span class="dateDescription">'+dateDesc2Saved+'</span>')
		// phrase-with-spaces_2021-03-26_10-23-52_table.png
		var fileName = (saved_d1.getMonth()+1)+'-'+saved_d1.getDate()+'-'+saved_d1.getFullYear()+'_'+
			(saved_d2.getMonth()+1)+'-'+saved_d2.getDate()+'-'+saved_d2.getFullYear()+"_date_durations.png";
		openImageWindow(".dateCalcTable2", fileName, optImageScale);
	});

	$("body").on("click", "#btn-print-word-break-png", function () {
		// phrase-with-spaces_English-Ordinal_190_breakdown.png
		for (var i = 0; i < cipherList.length; i++) { if (cipherList[i].cipherName == breakCipher) break; } // get current cipher index
		var fileName = sVal().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/ /g, "-").replace(/["|']/g, "")+
			"_"+breakCipher.replace(/ /g, "-")+"_"+cipherList[i].calcGematria(sVal())+"_breakdown.png";
		openImageWindow("#BreakTableContainer", fileName, optImageScale);
	});

	$("body").on("click", "#btn-print-breakdown-details-png", function () {
		var i = 0;
		for (i; i < cipherList.length; i++) { if (cipherList[i].cipherName == breakCipher) break; } // get active cipher
		// phrase-with-spaces_English-Ordinal_190_card.png
		var fileName = sVal().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/ /g, "-").replace(/["|']/g, "")+
			"_"+breakCipher.replace(/ /g, "-")+"_"+cipherList[i].calcGematria(sVal())+"_card.png";
		openImageWindow("#BreakdownDetails", fileName, optImageScale);
	});

	$("body").on("click", "#btn-num-props-png", function () {
		// 123_number_properties.png OR 123_alt_number_properties.png
		var curNum = document.querySelector('.numPropTooltip').dataset.number // current number
		var fileName = curNum+"_number_properties.png";
		openImageWindow(".numPropTooltip", fileName, optImageScale);
	});

	$("body").on("change", "#importFileDummy", function(){
		var file = document.querySelector("#importFileDummy").files[0];
		importFileAction(file);
	});
	$("body").on("click", "#btn-export-history-png", function () {
		exportHistoryCSV(sHistory);
	});
	$("body").on("click", "#btn-export-matches-txt", function () {
		exportHighlighterMatches(sHistory);
	});
	$("body").on("click", "#btn-export-db-query", function () {
		exportCurrentDBquery(queryResult);
	});
	$("body").on("change", "#importFileDummyDict", function () {
		var file = document.querySelector("#importFileDummyDict").files[0];
		createDictFromFile(file);
	});
	$("body").on("click", "#btn-export-ciphers", function () {
		exportCiphers();
	});
	$("body").on("click", "#btn-save-settings", function () {
		saveCalcSettingsLocalStorage();
	});
	$("body").on("click", "#btn-restore-settings", function () {
		restoreCalcSettingsLocalStorage();
	});
	$("body").on("click", "#btn-reset-settings", function () {
		clearCalcSettingsLocalStorage();
	});
});

// ==================================================================
// highlighter.js

var userHistory = [] // a copy of user's history before filtering is applied
var userOpenCiphers = [] // a copy of user's choice of ciphers
var ctrlIsPressed = false; // allow Ctrl modifier key
var shiftIsPressed = false; // allow Shift modifier key

// used inside highlighter.js
var avail_match = []; // all matches found with auto highligher
var avail_match_freq = []; // frequency of matches found with auto highligher
var freq = []; // frequency of matches found with auto highlighter (combined)

var prevPhrID = -1 // index of previously selected phrase in history table
var prevCiphIndex = -1 // index of previously selected cipher in enabled ciphers table

var showCapsCipherChart = false // display uppercase letters in Cipher Chart

$(document).ready(function(){
	
	// Ctrl key modifier
	$(document).keydown(function(event){
		if(event.which=="17")
		ctrlIsPressed = true;
	});
	$(document).keyup(function(){
		ctrlIsPressed = false;
	});
	
	// Shift key modifier
	$(document).keydown(function(event){
		if(event.which=="16")
		shiftIsPressed = true;
	});
	$(document).keyup(function(){
		shiftIsPressed = false;
	});

	// Disable text selection (elements) while Shift is pressed
	["keyup","keydown"].forEach((event) => {
		window.addEventListener(event, (e) => {
			document.onselectstart = function() {
				return !(e.key == "Shift" && e.shiftKey);
			}
		});
	});

    $("#highlightBox").keyup(function(event){ // inside Highlight box
		if ( event.which == 46 ) { // "Delete" - clear box
			if(ctrlIsPressed) { // "Ctrl + Delete"
				removeActiveFilter(); // clear filter
			} else { // "Delete" only
				freq = []; // reset previously found matches statistics
				document.getElementById("highlightBox").value = "";
				updateHistoryTable();
			}
			return;
		}
		if ( event.which == 13 ) { // "Enter" - show only phrases that match
			if (document.getElementById("highlightBox").value !== "") removeNotMatchingPhrases(); // no action if empty
			return; // don't update history as function is different
		}
		if ( event.which == 45 ) { // "Insert" - auto highlighter, find all available matches
			updateHistoryTableAutoHlt();
			return; // don't update history
		}
		if (optFiltCrossCipherMatch) { autoHistoryTableLayout(); updateHistoryTable(); } else { updateHistoryTableSameCiphMatch(); }
    });
	
	$("body").on("click", "td.hC", function () { // Cipher Name in history table (normal mode)
		if(shiftIsPressed) { // Shift + Left Click
			var val = $(this).html(); // cipher name
			//console.log("    disabled: "+valueToRemove);
			//openCiphers = openCiphers.filter(function(item) { // list of active ciphers
			//	return item !== valueToRemove; // remove selected cipher
			//})
			for (i = 0; i < cipherList.length; i++) {
				if (cipherList[i].cipherName == val) {
					toggleCipher(i, true) // update checkbox
				}
			}
		}
	});
	
	$("body").on("click", "td.hCV", function () { // Cipher Name in history table (compact mode)
		if(shiftIsPressed) { // Shift + Left Click
			var val = $(this).find(".hCV2").html(); // cipher name
			for (i = 0; i < cipherList.length; i++) {
				if (cipherList[i].cipherName == val) {
					toggleCipher(i, true) // update checkbox
				}
			}
		}
	});
	
	// breakdown or cipher table letter/number clicked
	$("body").on("click", ".ChartVal, .BreakChar, .BreakVal, .BreakValDark, .BreakWordSum", function () {
		$(this).toggleClass('highlightCipherTable'); 
	});

	// cipher chart letter click (keyboard)
	$("body").on("click", ".ChartChar", function () {
		$('#phraseBox').val($('#phraseBox').val()+$(this).text());
		$(this).toggleClass('highlightCipherTable'); el = $(this);
		setTimeout(function (){ el.toggleClass('highlightCipherTable'); }, 75)
		updateEnabledCipherTable();
		updateWordBreakdown(breakCipher,false,false);
	});
	$("body").on("click", "#spaceChartBtn", function () { // space
		$('#phraseBox').val($('#phraseBox').val()+' ');
		$(this).toggleClass('highlightCipherTable'); el = $(this);
		setTimeout(function (){ el.toggleClass('highlightCipherTable'); }, 75);
		updateEnabledCipherTable();
		updateWordBreakdown(breakCipher,false,false);
	});
	$("body").on("click", "#backspaceChartBtn", function () { // backspace
		var s = stringToArrCodePoint($('#phraseBox').val()); s.pop(); // removes last codePoint
		$('#phraseBox').val(JSON.stringify(s).slice(1,-1).replace(/[\",]/g,'')); // array to string
		$(this).toggleClass('highlightCipherTable'); el = $(this);
		setTimeout(function (){ el.toggleClass('highlightCipherTable'); }, 75);
		updateEnabledCipherTable();
		updateWordBreakdown(breakCipher,false,false);
	});
	$("body").on("click", "#capsNameChartBtn", function () { // shift
		showCapsCipherChart = !showCapsCipherChart
		updateWordBreakdown(breakCipher,false,true); // update chart
		$(this).toggleClass('highlightCipherTable'); el = $(this);
		setTimeout(function (){ el.toggleClass('highlightCipherTable'); }, 75);
	});

	// history table value clicked (right mouse button)
	// disable context menu for the element so right click works
	$(".tC").live('contextmenu', function() { // ".bind" for existing elements, ".live" for future
		$(this).find(".gV").toggleClass('hideValue'); // <b> "style="display: none;"
		return false; // don't show menu
	})
	
	// history table value clicked (left mouse button)
	// trick is that ".gV" is " 12 ", not "12", so td:contains can't match it to " 112 "
	$("body").on("click", ".tC", function (e) { // tC - history table cell
		//console.log($(this).find(".gV").html()); // inner html of .gV found in "this"
		var val = $(this).find(".gV").html(); // get gematria value from element
		if(ctrlIsPressed) { // Ctrl + Left Click - toggle value inside highlight box
			tdToggleHighlight(parseInt(val.trim(), 10)); // remove spaces, parse as integer and add (remove) to highlight box
		} else { // Left Click only - temporary blinking effect
			$( "table.HistoryTable td.tC > span:contains('"+val+"')" ).toggleClass('highlightValueBlink'); // add blinking effect
		}
	});
	
	// Right click on cipher name in enabled cipher table
	$("body").on("contextmenu", ".phraseGemCiphName", function (e) { // tC - history table cell
		var val = $(this).text(); // get cipher name from element
		if (ctrlIsPressed && !precalcDBLoaded) { // if no precalculated database is loaded
			if (prevCiphIndex == -1) { // no previous selection
				$(this).addClass("selectedPhrase") // highlight
				for (i = 0; i < cipherList.length; i++) {
					if (cipherList[i].cipherName == val) prevCiphIndex = i // select cipher
				}
			} else { // previous selection exists
				var curCiphIndex
				for (i = 0; i < cipherList.length; i++) {
					if (cipherList[i].cipherName == val) curCiphIndex = i // get current index
				}
				var curCiph = cipherList[curCiphIndex]
				var prevCiph = cipherList[prevCiphIndex]

				if (curCiphIndex == prevCiphIndex) {
					$(this).removeClass("selectedPhrase") // clear selection
					prevCiphIndex = -1 // reset
				} else { // different indices
					cipherList.splice(prevCiphIndex, 1) // remove previous cipher, shifts array
					origColors.splice(prevCiphIndex, 1) // update cipher colors
					cipherList.splice(curCiphIndex, 0, prevCiph) // insert previous at the index of current
					origColors.splice(curCiphIndex, 0, prevCiph)

					document.getElementById("calcOptionsPanel").innerHTML = "" // clear menu panel
					initCiphers(false) // don't update default ciphers, recalculate order of categories
					createCiphersMenu() // recreate menus
					createOptionsMenu()
					createFeaturesMenu()
					createExportMenu()
					createAboutMenu()

					if (userDBlive.length !== 0) { // restore controls if live database is loaded
						$("#queryDBbtn").removeClass("hideValue") // display query button
						$("#phraseBox").addClass("filterPhraseBox") // narrower field
						$("#clearDBqueryBtn").removeClass("hideValue") // clear button
						$("#unloadDBBtn").removeClass("hideValue") // unload database button
						$("#btn-export-db-query").removeClass("hideValue") // export button
						$("#liveDBOption").addClass("hideValue") // hide "Live Database Mode"
					}
					updateTables() // index is reset by update
				}
			}
		} else { // right click
			for (i = 0; i < cipherList.length; i++) {
				if (cipherList[i].cipherName == val) {
					toggleCipher(i, true) // update checkbox
				}
			}
		}
		return false; // don't show menu
	});

	// Click on phrase in history table
	$("body").on("click", ".hP", function (e) {
		if(shiftIsPressed) { // Shift + Left Click - remove phrase from history table
			//var val = $(this).html(); // get gematria value from element
			var ii = $(this).data("ind") // get phrase index
			if (sHistory.length == 1) {
				sHistory = [] // reinitialize array if there is only one entry
				tArea = document.getElementById("HistoryTableArea")
				tArea.innerHTML = "" // clear table
				updateTables()
				return
			}
			//sHistory.splice(sHistory.indexOf(val),1)
			sHistory.splice(ii,1)
			updateTables()
		} else if (ctrlIsPressed) { // Ctrl + Left Click - select phrase and load into phrase box
			//console.log($(this).html()); // inner html of "this"
			//var val = $(this).html(); // get gematria value from element
			//document.getElementById("phraseBox").value = val; // insert phrase into search box
			var ii = $(this).data("ind") // get phrase index
			document.getElementById("phraseBox").value = sHistory[ii]; // insert phrase into search box
			updateWordBreakdown() // update breakdown for current phrase
			updateEnabledCipherTable() // update enabled cipher values
			document.getElementById("phraseBox").focus(); // focus input
		}
	});

	// Ctrl + Right click on phrase in history table
	$("body").on("contextmenu", ".hP", function (e) { // tC - history table cell
		if (ctrlIsPressed) {
			hideContextMenu()
			var curPhrID = $(this).data("ind") // get phrase index
			if (prevPhrID == -1) { // no previous selection
				$(this).addClass("selectedPhrase")
				prevPhrID = curPhrID // save selection
			} else { // previous selection exists
				var prevPhr = sHistory[prevPhrID]
				if (curPhrID == prevPhrID) { // clear selection
					$(this).removeClass("selectedPhrase")
				} else { // different ids
					sHistory.splice(prevPhrID, 1) // remove previous phrase, shifts array
					sHistory.splice(curPhrID, 0, prevPhr) // insert previous at the index of current
					updateHistoryTable()
				}
				prevPhrID = -1 // reset
			}
			return false; // don't show menu
		}
	});

	// Ctrl + Click on phrase in query table
	$("body").on("click", ".hPQ", function (e) {
		if (ctrlIsPressed) { // Ctrl + Left Click - select phrase and load into phrase box
			var ii = $(this).data("ind") // get phrase index
			var phr = (encodingMenuOpened) ? queryResult[ii] : queryResult[ii][1] // phrase[1]
			document.getElementById("phraseBox").value = phr; // insert into search box
			updateWordBreakdown() // update breakdown for current phrase
			updateEnabledCipherTable() // update enabled cipher values
			if (navigator.maxTouchPoints <= 1) document.getElementById("queryPosInput").focus() // restore focus on desktop devices
			if (!optNewPhrasesGoFirst) { addPhraseToHistory(phr, true) } // enter as single phrase
			else { addPhraseToHistoryUnshift(phr, true) } // insert in the beginning
		}
	});
	
});

// ==================================================================
// num-prop.js - prime sieve variables stored separately
var primeNums; var triangularNums; var fibonacciNums; var starNums;

// ======================= Number Properties ========================

var hideNumPropTooltip = function() { // hide number properties
	$('div.numPropTooltip').remove();
};
$(document).ready(function() {

	var showTooltip = function(event) {
		// if (ctrlIsPressed || navigator.maxTouchPoints > 1) { // support for mobile devices
		if (ctrlIsPressed) { // desktop only
			$('div.numPropTooltip').remove(); // old tooltip
			val = $(this).text().trim() // remove spaces
			$('<div class="numPropTooltip" data-number="'+val+'">'+listNumberProperties(val)+'</div>').appendTo('body');
			changeTooltipPosition(event);
		}
		if (shiftIsPressed) { // additional properties
			$('div.numPropTooltip').remove(); // old tooltip
			val = $(this).text().trim() // remove spaces
			$('<div class="numPropTooltip" data-number="'+val+'_alt" style="max-width: unset;">'+listNumberPropertiesAlt(val)+'</div>').appendTo('body');
			changeTooltipPosition(event);
		}
	};

	var changeTooltipPosition = function(event, wasClicked = false) {
		if (ctrlIsPressed || shiftIsPressed || wasClicked == true) { // if modifier keys were used or opened with click
			hideContextMenu()
			var tW = $('div.numPropTooltip').outerWidth() // tooltip dimensions
			var tH = $('div.numPropTooltip').outerHeight()
			var wndW = $(window).width() // viewport dimensions
			var wndH = $(window).height()
			var viewportW = $(document).scrollLeft() // window scroll position
			var viewportH = $(document).scrollTop()
			var coordX = event.pageX // cursor coordinates
			var coordY = event.pageY
			var tooltipX = 0; var tooltipY = 0; // final tooltip coordinates
			//console.log("X:"+coordX+" Y:"+coordY)

			if (coordX + tW + 8 + 35 < viewportW + wndW) { // X position
				tooltipX = coordX + 8; // follow cursor position
			} else { // if outside of visible viewport
				tooltipX = viewportW + wndW - tW - 35 // display at furthest visible position
			}

			if (coordY + tH + 8 + 35 < viewportH + wndH) { // Y position
				tooltipY = coordY + 8;
			} else {
				tooltipY = viewportH + wndH - tH - 35
			}

			// bottom right corner, out of viewport
			if (coordX + tW + 8 + 35 > viewportW + wndW && coordY + tH + 8 + 35 > viewportH + wndH) {
				tooltipX = event.pageX - tW - 27 // display to the left and above of cursor
				tooltipY = event.pageY - tH - 27
			}
			
			$('div.numPropTooltip').css({top: tooltipY, left: tooltipX});
		}
	};

	$(document).on('click', function (e) {
		if ($(".numPropTooltip").length) { // if element exists
			if ($(e.target).closest(".numPropTooltip, .numProp, .gV, .gVQ, #calcOptionsPanel").length === 0 ) {
				hideNumPropTooltip(); // hide number properties when clicked outside, but not on menu elements
			}
		}
	});

	// numbers inside enabled ciphers and history tables
	$("body").on("mouseenter", ".numProp, .gV, .gVQ", showTooltip);
	$("body").on("mousemove", ".numProp, .gV, .gVQ", changeTooltipPosition);
	// $("body").on("mouseleave", ".numProp, .gV", hideNumPropTooltip)
	$("body").on("mouseleave", "div.numPropTooltip", hideNumPropTooltip);

	var showTooltipClick = function(event) {
		$('div.numPropTooltip').remove(); // old tooltip
		val = $(this).text().trim() // remove spaces
		$('<div class="numPropTooltip" data-number="'+val+'">'+listNumberProperties(val)+'</div>').appendTo('body');
		changeTooltipPosition(event, true); // a click was issued
	}
	var showTooltipClickAlt = function(event) {
		$('div.numPropTooltip').remove(); // old tooltip
		val = $(this).text().trim() // remove spaces
		$('<div class="numPropTooltip" data-number="'+val+'_alt" style="max-width: unset;">'+listNumberPropertiesAlt(val)+'</div>').appendTo('body');
		changeTooltipPosition(event, true);
		return false; // no context menu
	};

	$("body").on("click", ".numProp", showTooltipClick);
	$("body").on("contextmenu", ".numProp", showTooltipClickAlt);

});

// ==================================================================
// encoding.js

var encodingMode = 0 // 0 - syllables, 1 - use database (1 phrase), 2 - use database (2 phrases)
var encOddLength = false // use odd letters for syllable mode
var encSylMaxPhrases = 10 // max phrases to generate for syllable mode
var encDefAlphArr = 'abcdefghijklmnopqrstuvwxyz'
var encDefVowArr = 'aeiouy'
var encDefExcLetArr = 'qzjx'
var encPrevAlphStr = encDefAlphArr // store previously defined alphabet
var encPrevVowStr = encDefVowArr
var encPrevExcLetStr = encDefExcLetArr