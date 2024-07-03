// ========================== Highlighter ===========================

function removeZeroHlt(arr) {
	for (p = 0; p < arr.length; p++) {
		if (arr[p] == 0) arr.splice(p,1) // remove zero
	}
	return arr
}

function removeNotMatchingPhrases() {
	// highlight box values to array
	highlt = document.getElementById("highlightBox").value.replace(/ +/g," ") // get value, remove double spaces
	highlt_num = highlt.split(" ") // create array from string, space as delimiter
	highlt_num = highlt_num.map(function (x) { return parseInt(x, 10); }) // parse string array as integer array to exclude quotes
	highlt_num = removeZeroHlt(highlt_num)
	
	// create a copy of history, since matching is destructive
	if (userHistory.length == 0) userHistory = [...sHistory] // don't make new copies until filter is reset
	
	var phr_values = []
	var match = false
	var x = 0

	// remove not matching phrases first
	while (x < sHistory.length) { // for each phrase in history
	
		phr_values = [] // reinit
		match = false
		
		for (i = 0; i < cipherList.length; i++) { // for each enabled cipher
			if (cipherList[i].enabled) {
				gemVal = cipherList[i].calcGematria(sHistory[x]) // value only
				phr_values.push(gemVal) // build an array of all gematria values of current phrase
			}
		}
		//console.log(phr_values)
		for (z = 0; z < highlt_num.length; z++) { // for each value to be highlighted
			if (phr_values.indexOf(highlt_num[z]) > -1 && !match) { // if value is present in any gematria cipher
				match = true // if match is found
			}
		}
		//console.log(match)
		if (!match) { // if no match is found, don't do x++ as array indices shift
			//console.log("removed: '"+sHistory[x]+"'")
			sHistory.splice(x,1) // remove phrase
		} else {
			x++ // check next item if match is found
		}
	}
	
	if (optFiltCrossCipherMatch) {
		// make a copy of user's choice of ciphers
		if (userOpenCiphers.length == 0) { // don't make new copies until filter is reset
			//userOpenCiphers = [...openCiphers]
			// tmp
			for (i = 0; i < cipherList.length; i++) {
				//tmp = Object.assign({}, cipherList[i]);
				userOpenCiphers.push(cipherList[i].enabled); // save state for each cipher
			}
		}
		
		for (i = 0; i < cipherList.length; i++) { // for each enabled cipher
			if (cipherList[i].enabled) {
				var ciph_values = [] // init
				match = false
				
				for (x = 0; x < sHistory.length; x++) { // for each phrase
					ciph_values.push(cipherList[i].calcGematria(sHistory[x]))
				}
				
				for (z = 0; z < highlt_num.length; z++) { // for each value to be highlighted
					if (ciph_values.indexOf(highlt_num[z]) > -1 && !match) { // if any value is found for that cipher
						match = true // match is found
					}
				}
			
				if (!match) { // if no match is found
					//console.log("    disabled: '"+ciphersOn[i].Nickname+"'")
					valueToRemove = cipherList[i].cipherName
					//openCiphers = openCiphers.filter(function(item) { // list of active ciphers
					//	return item !== valueToRemove // remove current cipher
					//})
					for (n = 0; n < cipherList.length; n++) {
						if (cipherList[n].enabled) {
							//console.log(cipherList[n].cipherName+" == "+valueToRemove)
							if (cipherList[n].cipherName == valueToRemove) {
								cipherList[n].enabled = false // disable cipher
								cur_chkbox = document.getElementById("cipher_chkbox"+n)
								if (cur_chkbox !== null) { cur_chkbox.checked = !cur_chkbox.checked; } // update checkbox if visible
							}
						}
					}
				}
			}
		}		

		updateEnabledCipherTable() // update ciphers
	}
	
	if (optFiltSameCipherMatch) {
		
		// mark all phrases to false
		// search each column for unique
		// for each unique, if more than 1 match mark phrases as true, if none are found remove cipher
		// build new history with phrases marked as true
		
		// check each entered value for each cipher column (all phrases)
		// if number matches in that column twice or more mark XY coordinates for highlighter
		// if number is found only once ignore it in that column, repeat for all columns
		// openHistory table and adjust alpha channel color for each cell based on XY
		// it will be a 2D array of true/false, true are bright, false are darkened
		
		// make a copy of user's choice of ciphers
		if (userOpenCiphers.length == 0) { // don't make new copies until filter is reset
			for (i = 0; i < cipherList.length; i++) {
				userOpenCiphers.push(cipherList[i].enabled); // save state for each cipher
			}
		}
		
		var phrase_match = Array(sHistory.length).fill(false); // mark phrases that match in same cipher, same value
		//console.log("phrase_match:"+JSON.stringify(phrase_match))
		
		for (var i = 0; i < cipherList.length; i++) { // for each enabled cipher, var i - so it can be referenced later
			if (cipherList[i].enabled) {
			
				var ciph_values = [] // values for each phrase in one cipher
				var ciph_matches = [] // frequency of matches in one cipher
				
				for (x = 0; x < sHistory.length; x++) { // for each phrase
					ciph_values.push(cipherList[i].calcGematria(sHistory[x])) // add value for that phrase
				}
				
				ciph_matches = countMatches(ciph_values) // number of occurrences of values
				//console.log("ciph_values:"+JSON.stringify(ciph_values))
				//console.log("ciph_matches:"+JSON.stringify(ciph_matches))
				
				var cipher_has_no_matches = true
				for (n = 0; n < ciph_matches.length; n++) { // for each value in cipher column
					if (ciph_matches[n][1] > 1) { // if 2 or more matches are available
						for (x = 0; x < sHistory.length; x++) { // for each phrase
							if (cipherList[i].calcGematria(sHistory[x]) == ciph_matches[n][0] &&
							highlt_num.indexOf(cipherList[i].calcGematria(sHistory[x])) > -1) { // if gematria for phrase matches given number and number is in highlight box
								phrase_match[x] = true // mark phrase as matching
								cipher_has_no_matches = false // cipher doesn't need to be disabled
								//console.log(sHistory[x]+" ("+ciphersOn[i].Nickname+") = "+ciphersOn[i].Gematria(sHistory[x], 2, false, true)+" - marked as 'true'")
							}
						}
					}
				}
				
				if (cipher_has_no_matches) { // remove current cipher if no phrases match with same value
					valueToRemove = cipherList[i].cipherName
					for (n = 0; n < cipherList.length; n++) {
						if (cipherList[n].cipherName == valueToRemove) {
							cipherList[n].enabled = false // disable cipher
							cur_chkbox = document.getElementById("cipher_chkbox"+n)
							if (cur_chkbox !== null) cur_chkbox.checked = !cur_chkbox.checked // update checkbox if visible
						}
					}
					//console.log("'"+cipherList[i].cipherName+"' was disabled")
				}
				
			}
		}
		
		var matchingPhrases = []
		for (m = 0; m < phrase_match.length; m++) { // for each phrase checked
			if (phrase_match[m] == true) { // add if matching
				matchingPhrases.push(sHistory[m])
			}
		}
		
		sHistory = matchingPhrases // switch sHistory to set of phrases that match
		// console.log("sHistory:")
		// console.log(sHistory)

		// columns of cipher values
		v_grid_col = [] // 2D array, columns of gematria values for enabled ciphers for all matching phrases
		tmp_arr = [] // all gematria values for one phrase
		for (n = 0; n < cipherList.length; n++) { // for each enabled cipher
			if (cipherList[n].enabled) {
				tmp_arr = [] // reset
				for (z = 0; z < sHistory.length; z++) { // for each phrase
					tmp_arr.push(cipherList[n].calcGematria(sHistory[z])) // add each gematria value for that phrase
				}
				v_grid_col.push(tmp_arr) // add row with all values for current phrase
			}
		}
		// console.log("v_grid_col:")
		// console.log(v_grid_col)

		updateEnabledCipherCount() // get number of enabled ciphers

		hltBoolArr = [] // highlight boolean array [phrase][cipher]
		tmpArr = []
		for (n = 0; n < sHistory.length; n++) { // for each phrase
			tmpArr = new Array(enabledCiphCount).fill(false) // for each cipher
			hltBoolArr.push(tmpArr) // add to array
		}

		// n - cipher, m/z - phrase
		for (n = 0; n < v_grid_col.length; n++) { // for each column (cipher)
			for (m = 0; m < v_grid_col[n].length; m++) { // for each value in column (phrase)
				if (highlt_num.indexOf(v_grid_col[n][m]) > -1) { // if value is in highlight box
					for (z = m+1; z < v_grid_col[n].length; z++) { // compare vs other values in same column
						if (v_grid_col[n][m] == v_grid_col[n][z]) { // if value matches another value
							hltBoolArr[m][n] = true // mark both as values to be highlighted
							hltBoolArr[z][n] = true // [phrase][cipher]
						}
					}
				}
			}
		}
		// console.log("hltBoolArr:")
		// console.log(hltBoolArr)

		updateEnabledCipherTable() // update ciphers
	}
	
	var o = '<input id="btn-clear-active-filter" type="button" value="X" onclick="removeActiveFilter();displayCipherCatDetailed(cCat[0]);"/>'
	$("#clearFilterButton").html(o) // clear active filter button
	
	autoHistoryTableLayout()
	if (optFiltSameCipherMatch) {
		updateHistoryTable(hltBoolArr) // rebuild table, pass boolean array for highlighting
	} else if (optFiltCrossCipherMatch) {
		updateHistoryTable()
	}
}

function updateHistoryTableSameCiphMatch() {

	highlt = document.getElementById("highlightBox").value.replace(/ +/g," ") // get value of Highlight textbox, remove double spaces

	highlt_num = highlt.split(" "); // create array, space delimited numbers
	highlt_num = highlt_num.map(function (e) { return parseInt(e, 10); }) // parse string array as integer array to exclude quotes
	highlt_num = removeZeroHlt(highlt_num)
	// console.log("highlt_num:")
	// console.log(highlt_num)

	// columns of cipher values
	v_grid_col = [] // 2D array, columns of gematria values for enabled ciphers for all matching phrases
	tmp_arr = [] // all gematria values for one phrase
	for (n = 0; n < cipherList.length; n++) { // for each enabled cipher
		if (cipherList[n].enabled) {
			tmp_arr = [] // reset
			for (z = 0; z < sHistory.length; z++) { // for each phrase
				tmp_arr.push(cipherList[n].calcGematria(sHistory[z])) // add each gematria value for that phrase
			}
			v_grid_col.push(tmp_arr) // add row with all values for current phrase
		}
	}
	// console.log("v_grid_col:")
	// console.log(v_grid_col)

	hltBoolArr = [] // highlight boolean array [phrase][cipher]
	tmpArr = []
	for (n = 0; n < sHistory.length; n++) { // for each phrase
		tmpArr = new Array(enabledCiphCount).fill(false) // for each cipher
		hltBoolArr.push(tmpArr) // add to array
	}

	// n - cipher, m/z - phrase
	for (n = 0; n < v_grid_col.length; n++) { // for each column (cipher)
		for (m = 0; m < v_grid_col[n].length; m++) { // for each value in column (phrase)
			if (highlt_num.indexOf(v_grid_col[n][m]) > -1) { // if value is in highlight box
				for (z = m+1; z < v_grid_col[n].length; z++) { // compare vs other values in same column
					// if value matches another value in the same column and is present in highlight box
					if (v_grid_col[n][m] == v_grid_col[n][z]) { 
						hltBoolArr[m][n] = true // mark both as values to be highlighted
						hltBoolArr[z][n] = true // [phrase][cipher]
					}
				}
			}
		}
	}
	// console.log("hltBoolArr:")
	// console.log(hltBoolArr)

	updateHistoryTable(hltBoolArr) // rebuild table, same cipher match
}

function removeActiveFilter() {
	$("#clearFilterButton").html("") // remove clear button
	$("#highlightBox").val("") // clear highlightBox box

	for (i = 0; i < userOpenCiphers.length; i++) {
		cipherList[i].enabled = userOpenCiphers[i];
	}
	
	sHistory = [...userHistory] // restore user history table
	userHistory = [] // clear snapshot of user history
	userOpenCiphers = [] // clear snapshot of user ciphers
	
	updateEnabledCipherTable() // update ciphers
	autoHistoryTableLayout()
	updateHistoryTable() // update history
}

// number of items in array
function countMatches(arr) {
	var values = []
	var counts = []
	var index = 0
	
	for (i = 0; i < arr.length; i++) {
		index = values.indexOf(arr[i])
		if (index == -1) { // new value
			values.push(arr[i]) // add entry
			counts.push(1) // first occurrence
		} else { // if same value found again
			counts[index] += 1 // increment number of matches
		}
	}
	
	var result = [] // frequency of matches
	var tmp = []

	for (i = 0; i < values.length; i++) { // join values and counts
		tmp = new Array(values[i], counts[i])
		result.push(tmp)
	}
	
	return result // 2D array [number, frequency]
}

function updateHistoryTableAutoHlt() {
	var x, y, aCipher, gemVal

	var rows_arr = [] // array of arrays, each array (row) has gematria values for a single phrase
	var phrase_values = [] // array of gematria values for a single phrase
	avail_match = [] // reinit (var declared in highlighter.js)
	avail_match_freq = [] // var declared in highlighter.js
	
	if (sHistory.length == 0) {return}
	
	if (optFiltSameCipherMatch) { // phrases that have the same value in the same cipher
	
		var cols_arr = [] // array of arrays, each array (COLUMN) has gematria values for a each phrase in one cipher
		var cipher_values = [] // values for each phrase in one cipher
		
		for (y = 0; y < cipherList.length; y++) {
			if (cipherList[y].enabled) { // for each enabled cipher
				for (x = 0; x < sHistory.length; x++) { // calculate gematria for all phrases
					gemVal = cipherList[y].calcGematria(sHistory[x]) // value only
					cipher_values.push(gemVal) // append all values of this phrase
				}
			cols_arr.push(cipher_values) // append all values of each phrase
			cipher_values = [] // reinit	
			}
		}
		// console.log("cols_arr:")
		// console.log(cols_arr)
		
		var col_matches = [] // frequency of values within one cipher for all phrases
		for (q = 0; q < cols_arr.length; q++) { // for each enabled cipher (column), using "i" created some impossible infinte loop bug
			col_matches = []
			col_matches = countMatches(cols_arr[q]) // find matches within the same cipher
			// console.log(col_matches)
			for (n = 0; n < col_matches.length; n++) { // for each value in match array
				if (col_matches[n][1] > 1) { // if 2 or more matches are available
					if (avail_match.indexOf(col_matches[n][0]) == -1) avail_match.push(col_matches[n][0]) // add new value to list of valid matches
				}
			}
		}
		// console.log("avail_match:")
		// console.log(avail_match)
		
		avail_match.sort(function(a, b) { // sort ascending order
			return a - b; //  b - a, for descending sort
		});
		if (avail_match[0] == 0) avail_match.splice(0,1) // remove zero
		
		console.log(JSON.stringify(avail_match).replace(/,/g, " ").slice(1, -1)) // print available matches
		//console.log(JSON.stringify(freq).replace(/\],\[/g, "\n").slice(2, -2)) // print frequency of available matches
		
		// paste available values inside Highlight textbox
		str = JSON.stringify(avail_match).replace(/,/g, " ") // replace comma with space
		substr = str.substring(1, str.length - 1) // remove brackets
	    
		document.getElementById("highlightBox").value = substr // populate highlight box

		updateHistoryTableSameCiphMatch() // update table
		
		//freq = [] // frequency of matches found with auto highlighter
		// freq needs different logic for same cipher match
		return

	}
	
	for (x = 0; x < sHistory.length; x++) { // calculate gematria for all phrases
		for (y = 0; y < cipherList.length; y++) {
			if (cipherList[y].enabled) {
				aCipher = cipherList[y]
				gemVal = aCipher.calcGematria(sHistory[x]) // value only
				phrase_values.push(gemVal) // append all values of this phrase
			}
		}
		rows_arr.push(phrase_values) // append all values of each phrase
		phrase_values = [] // reinit	
	}
		
	//auto highlighter, all available values
	var this_row = [] // match this row
	var against_row = [] // against another row
	var val = 0 // value that is checked (try "")
	
	var p = 0 // position (column) in against_row
	var index = 0 // index of val in array of previously found matches
	
	var n_rows = rows_arr.length // number of phrases
	var n_cols = rows_arr[0].length // number of values (ciphers) for each phrase (same value)
	
	var steps = 0 // number of steps taken
	
	for (i = 0; i < n_rows; i++) { // loop array
		this_row = rows_arr[i] // select row with phrase values
		for (n = 0; n < n_cols; n++) {
			val = this_row[n] // take the first value of the first phrase
			if (val > 0 && avail_match.indexOf(val) == -1) { // ignore zero, take value that hasn't been checked
				//console.log("# row:"+(i+1)+" column:"+(n+1)+" value:"+val)
				for (m = i+1; m < n_rows; m++) { // loop array again to find matches, start check from the next row
					against_row = rows_arr[m] // select another row
					p = 0 // reset position in row
					while (p < n_cols) { // loop values in that row
						steps++
						if (val == against_row[p]) { // if matching value is found in other rows (phrases)
							index = avail_match.indexOf(val) // save index
							//console.log("    matches with:"+against_row[p]+" at "+(m+1)+":"+(p+1)) // at row/column
							if (index == -1) { // if value is not in array of available matches yet
								avail_match.push(val) // push to array, so number is not selected again during the first (selection) loop of the array
								avail_match_freq.push(2) // first match means 2 values were found
								//console.log("        new value found, making a new array to count "+against_row[p])
								//console.log("            "+against_row[p]+" has position "+avail_match.indexOf(val)+" in "+JSON.stringify(avail_match))
							} else { // if value already exists in array of matches
								avail_match_freq[index] += 1 // increment number of occurrencies found at correspondent index
								//console.log("        found match at "+(m+1)+":"+(p+1)+" incrementing "+against_row[p]+" to "+avail_match_freq[index])
							}
							if (m+1 < n_rows) { // switch to next row (if possible) after match is found
								m++
								against_row = rows_arr[m] // against_row = rows_arr[m+1] - gets stuck in an infinite increment loop
								p = 0 // switch to first value in next row
							} else {
								break // break infinite loop on the last row check
							}
						} else {
							p++ // if no match is found, check next value of the same row
						}
					}
				}
			}
		}
	}
	console.log("rows:"+n_rows+" columns:"+n_cols+" values:"+(n_rows*n_cols)+" steps_taken:"+steps)
	
	freq = [] // frequency of matches found with auto highlighter (var declared in ijavaNGG.js)
	var tmp = []
	for (i = 0; i < avail_match.length; i++) { // join values and frequency
		tmp = new Array(avail_match[i],avail_match_freq[i])
		freq.push(tmp)
	}
	
	freq.sort(function(a, b) {
		return a[1] - b[1]; // sort based on index 1 values ("freq" is array of arrays), (b-a) descending order, (a-b) ascending
	});
	
	avail_match.sort(function(a, b) { // sort ascending order
		return a - b; //  b - a, for descending sort
	});
	
	console.log(JSON.stringify(avail_match).replace(/,/g, " ").slice(1, -1)) // print available matches
	console.log(JSON.stringify(freq).replace(/\],\[/g, "\n").slice(2, -2)) // print frequency of available matches
	
	// paste available values inside Highlight textbox
	str = JSON.stringify(avail_match).replace(/,/g, " ") // replace comma with space
	substr = str.substring(1, str.length - 1) // remove brackets
	document.getElementById("highlightBox").value = substr

	updateHistoryTable() // update table
}

// add number to Highlight box (history table is rebuilt)
function tdToggleHighlight(val){ // click on value in history table to toggle highlighter
    //console.log('Clicked on: '+val)
	highlt = document.getElementById("highlightBox").value.replace(/ +/g," ") // get value, remove double spaces
	lastchar = highlt.substring(highlt.length-1,highlt.length)
	
	highlt_num = highlt.split(" ") // create array, space delimited numbers
	highlt_num = highlt_num.map(function (x) { return parseInt(x, 10); }) // parse string array as integer array to exclude quotes
	highlt_num = removeZeroHlt(highlt_num)
	
	var ind = highlt_num.indexOf(val) // val needs to be an integer
	//console.log("val:"+val+" ind:"+ind+" highlt_num:"+JSON.stringify(highlt_num))
	
	// disable
	var hlt_val
	if (ind > -1) { // if value is present
		highlt_num.splice(ind,1) // remove value
		hlt_val = JSON.stringify(highlt_num).replace(/,/g, " ") // to string
		hlt_val = hlt_val.substring(1, hlt_val.length-1) // remove brackets
		document.getElementById("highlightBox").value = hlt_val // update values inside textbox
		if (optFiltCrossCipherMatch) { updateHistoryTable(); } else { updateHistoryTableSameCiphMatch(); }
		return
	}
	
	// enable
	if (lastchar !== " " && highlt.length > 0) {
		document.getElementById("highlightBox").value += " " // append space if necessary
	}
	document.getElementById("highlightBox").value += val // append clicked value to Highlight textbox
	if (optFiltCrossCipherMatch) { updateHistoryTable(); } else { updateHistoryTableSameCiphMatch(); }
};