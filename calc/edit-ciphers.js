// ========================== Edit Ciphers ==========================

function toggleEditCiphersMenu() {

	if (!editCiphersMenuOpened) {

		closeAllOpenedMenus()

		editCiphersMenuOpened = true
		
		var o = '<div class="editCiphersContainer">'
		o += '<input class="closeMenuBtn" type="button" value="&#215;" onclick="closeAllOpenedMenus()">'

		o += '<table class="custCipherMainTable"><tbody>'
		o += '<tr><td style="text-align: center; padding: 0em 1em 1em 0em;"><input id="custCipherNameInput" type="text" autocomplete="off" oninput="checkCustCipherName()" placeholder="Cipher Name"></td>'
		o += '<td style="text-align: center; padding: 0em 0em 1em 0em;"><input id="custCipherCatInput" type="text" autocomplete="off" placeholder="Category"></td></tr>'
		o += '<tr><td colspan=2><input id="custCipherAlphabet" type="text" autocomplete="off" oninput="createIndLetterControls()" placeholder="Characters (abc)"></td></tr>'
		o += '<tr><td colspan=2><textarea id="custCipherGlobVals" type="text" autocomplete="off" oninput="createIndLetterControls()" placeholder="Values (1,2,3)"></textarea></td></tr>'
		o += '</tbody></table>'

		o += '<div>' // container for checkboxes
		var IDMstate = ""
		if (ignoreDiarciticsCustom) IDMstate = "checked" // checkbox state
		o += '<div id="diacrChkbox"><label class="chkLabel optionElementLabel">Ignore Diacritical Marks (é=e)<input type="checkbox" id="chkbox_IDM" onclick="conf_IDM()" '+IDMstate+'><span class="custChkBox"></span></label></div>'
		var CSstate = ""
		if (caseSensitiveCustom) CSstate = "checked" // checkbox state
		o += '<div id="caseSensChkbox"><label class="chkLabel optionElementLabel">Case Sensitive Cipher<input type="checkbox" id="chkbox_CS" onclick="conf_CS()" '+CSstate+'><span class="custChkBox"></span></label></div>'
		o += '</div>' // close

		o += '<div id="custCipherIndCtrls"></div>' // individual characters controls
		o += '<div id="custCipherButtonArea"><input class="ciphEditBtn" type="button" value="Add New Cipher" onclick="addNewCipherAction()"></div>' // buttons
		o += '</div>'

		document.getElementById("editCiphersMenuArea").innerHTML += o // add element to page
	} else {
		document.getElementById("editCiphersMenuArea").innerHTML = "" // clear
		editCiphersMenuOpened = false
	}
}

function conf_IDM() { // ignore diacritical marks
	ignoreDiarciticsCustom = !ignoreDiarciticsCustom // toggle
	createIndLetterControls() // update
}

function conf_CS() { // case sensitive cipher
	caseSensitiveCustom = !caseSensitiveCustom // toggle
	createIndLetterControls() // update
}

function checkCustCipherName() { // redraw add/update cipher button
	var custName = document.getElementById("custCipherNameInput").value.trim() // remove spaces from both ends
	var updFlag = false
	for (i = 0; i < cipherList.length; i++) {
		if (cipherList[i].cipherName == custName) { updFlag = true; break; }
	}

	var o = ""
	if (updFlag) { // cipher exists
		o += '<input class="ciphEditBtn" type="button" value="Update Existing Cipher" onclick="addNewCipherAction()">'
		o += '<input class="ciphEditBtn" type="button" value="New Random Color" onclick="addNewCipherAction(true)">'
		o += '<input class="ciphEditBtn" type="button" value="Delete Cipher" onclick="deleteCipherAction()">'
		document.getElementById("custCipherButtonArea").innerHTML = o
	} else {
		o += '<input class="ciphEditBtn" type="button" value="Add New Cipher" onclick="addNewCipherAction()">'
		document.getElementById("custCipherButtonArea").innerHTML = o
	}
}

function createIndLetterControls() {
	var alphabet = document.getElementById("custCipherAlphabet").value
	alphabet = alphabet.replace(/\t/g,"").replace(/ /g,"") // to lowercase, remove tabs and spaces
	if (!caseSensitiveCustom) alphabet = alphabet.toLowerCase()
	if (ignoreDiarciticsCustom) alphabet = alphabet.normalize('NFD').replace(/[\u0300-\u036f]/g, "") // remove diacritics
	document.getElementById("custCipherAlphabet").value = alphabet

	var customChars = alphabet.split("") // string to array
	// console.log(JSON.stringify(customChars))

	var alphabetValues = document.getElementById("custCipherGlobVals").value
	alphabetValues = alphabetValues.replace(/\t/g,",").replace(/ /g,",") // replace tabs and spaces with comma
	document.getElementById("custCipherGlobVals").value = alphabetValues

	var customVals = alphabetValues.split(",") // string to array
	if (customVals[0] == "" && customVals.length == 1) {
		customVals = [] // empty array
	} else {
		customVals = customVals.map(function (e) { return parseInt(e, 10); }) // parse string array as integer array to exclude quotes
	}

	var cur_ciph_index = 0 // index of current of enabled cipher that will be added to the table (total # of ciphers added so far + 1)
	var new_row_opened = false // condition to open new row inside table
	var charsInCurRow = 0 // count ciphers in current row

	var charsInRow = 10

	var o = '<table class="custCipherTable"><tbody>'
	
	//  flip logic, if charsInRow is reached, switch to next row but use values from beginning, then flip back to chars
	var tmpValues = []
	var curCharVal = 0
	for (i = 0; i < customChars.length; i++) {
		
		if (typeof customVals[i] !== 'undefined' && customVals[i] !== "") { // read from array if available
			curCharVal = customVals[i];
		} else {
			curCharVal = i+1 // use default values - 1,2,3...
			if (customVals.length > 0) { customVals.push(curCharVal); } else { customVals = [curCharVal]; } // add value
			tmpValues = JSON.stringify(customVals).slice(1,-1)
			document.getElementById("custCipherGlobVals").value = tmpValues // update box with new value
		}

		cur_ciph_index++
		if (!new_row_opened) { // check if new row has to be opened
			o += '<tr>'
			new_row_opened = true
		}
		var chk = ""
		if (charsInCurRow < charsInRow) { // until number of ciphers in row equals number of columns
			o += '<td><table class="custCharIndTable"><tbody>'
			o += '<tr><td class="custCharIndLabel"><input id="custChar'+i+'" type="text" autocomplete="off" oninput="changeIndLetter('+i+')" class="custCharInd" value="'+customChars[i]+'"></input></td></tr>'
			o += '<tr><td><input id="chVal'+i+'" type="text" autocomplete="off" oninput="changeIndLetterValue('+i+')" class="custCharIndValue" value="'+curCharVal+'"></input></div></center></td></tr>'
			o += '</tbody></table></td>'
			charsInCurRow++
		}
		if (charsInCurRow == charsInRow) { // check if row needs to be closed
			o += '</tr>'
			charsInCurRow = 0 // reset character count
			new_row_opened = false
		}
	}
	o += '</tbody></table>'

	document.getElementById("custCipherIndCtrls").innerHTML = o
}

function changeIndLetterValue(id) { // update char value from individual input box
	var alphabetValues = document.getElementById("custCipherGlobVals").value
	var valArr = alphabetValues.split(",") // string to array
	valArr = valArr.map(function (e) { return parseInt(e, 10); }) // parse string array as integer array to exclude quotes

	var curIdVal = document.getElementById("chVal"+id+"").value // get value for current char
	valArr[id] = parseInt(curIdVal) // update value for current char

	tmpVal = JSON.stringify(valArr).slice(1,-1) // convert to string
	document.getElementById("custCipherGlobVals").value = tmpVal // update box with new values
}

function changeIndLetter(id) { // update char from individual box
	var curIdChar = document.getElementById("custChar"+id+"").value.substring(0,1) // get current char, to lowercase, one char only
	if (!caseSensitiveCustom) curIdChar = curIdChar.toLowerCase()
	if (ignoreDiarciticsCustom) curIdChar = curIdChar.normalize('NFD').replace(/[\u0300-\u036f]/g, "") // remove diacritics

	if (curIdChar !== "") { // if not empty
		document.getElementById("custChar"+id+"").value = curIdChar // replace box with first lowercase character

		var alphabet = document.getElementById("custCipherAlphabet").value
		var customChars = alphabet.split("") // string to array

		customChars[id] = curIdChar // update current char
		tmpChar = JSON.stringify(customChars).slice(1,-1).replace(/\"/g, "").replace(/,/g, "") // convert to string, remove brackets, remove quotes, commas
		document.getElementById("custCipherAlphabet").value = tmpChar // update box with new characters
	}
}

function addNewCipherAction(updCiphCol = false) { // update existing cipher if ID is specified
	var custName = document.getElementById("custCipherNameInput").value.trim()
	// console.log(custName)
	var custCat = document.getElementById("custCipherCatInput").value
	// console.log(custCat)

	var alphabet = document.getElementById("custCipherAlphabet").value
	var charsArr = []; var tmp = 0 // array with charcodes
	alphabet = alphabet.split("")

	for (i = 0; i < alphabet.length; i++) {
		tmp = alphabet[i].replace(/\"/g, "").charCodeAt(0) // remove quotes, get charcode
		charsArr.push(tmp)
	}
	// console.log(charsArr)

	var alphabetValues = document.getElementById("custCipherGlobVals").value
	var valArr = alphabetValues.split(",") // string to array
	valArr = valArr.map(function (e) { return parseInt(e, 10); }) // parse string array as integer array to exclude quotes
	valArr = valArr.splice(0, charsArr.length) // use assigned values only (remove all extra)
	// console.log(valArr)

	// check if cipher has to be replaced/updated
	var replaceID = -1
	for (i = 0; i < cipherList.length; i++) {
		if (cipherList[i].cipherName == custName) { replaceID = i; break; } // if name matches existing cipher
	}

	resetColorControls() // reset color changes (otherwise they become permanent)
	var custCipher
	if (replaceID > -1) { // cipher needs to be updated (retain colors)
		if (!updCiphCol) { custCipher = new cipher(custName, custCat, cipherList[replaceID].H, cipherList[replaceID].S, cipherList[replaceID].L, charsArr, valArr, ignoreDiarciticsCustom, true, caseSensitiveCustom) }
		else { custCipher = new cipher(custName, custCat, getRndIndex(rndCol.H), getRndIndex(rndCol.S), getRndIndex(rndCol.L), charsArr, valArr, ignoreDiarciticsCustom, true, caseSensitiveCustom) }
		if (cipherList[replaceID].cipherCategory == custCat) { // same category
			cipherList[replaceID] = custCipher // replace existing cipher
		} else if (cCat.indexOf(custCat) > -1) { // other existing category
			cipherList.splice(replaceID, 1) // remove original cipher first
			for (i = cipherList.length-1; i > -1; i--) { // go in reverse order
				// insert after last cipher in that category
				if (cipherList[i].cipherCategory == custCat) { cipherList.splice(i+1, 0, custCipher); break; }
			}
		} else if (cCat.indexOf(custCat) == -1) { // new category
			cipherList.splice(replaceID, 1) // remove original cipher first
			cipherList.push(custCipher) // add new cipher in the end of array
		}
	} else { // use random colors
		// custCipher = new cipher(custName, custCat, rndInt(0, 360), rndInt(0, 68), rndInt(53, 67), charsArr, valArr, ignoreDiarciticsCustom, true, caseSensitiveCustom)
		custCipher = new cipher(custName, custCat, getRndIndex(rndCol.H), getRndIndex(rndCol.S), getRndIndex(rndCol.L), charsArr, valArr, ignoreDiarciticsCustom, true, caseSensitiveCustom)
		if (cCat.indexOf(custCat) > -1) { // existing category
			for (i = cipherList.length-1; i > -1; i--) { // go in reverse order
				// insert after last cipher in that category
				if (cipherList[i].cipherCategory == custCat) { cipherList.splice(i+1, 0, custCipher); break; }
			}
		} else { // new category
			cipherList.push(custCipher) // add new cipher in the end of array
		}
	}

	initCalcCustCiph() // update
}

function deleteCipherAction() {
	var curCiphName = document.getElementById("custCipherNameInput").value.trim() // remove spaces
	resetColorControls() // reset color changes (otherwise they become permanent)
	for (i = 0; i < cipherList.length; i++) { // get cipher ID
		if (cipherList[i].cipherName == curCiphName) { cipherList.splice(i,1); break; } // remove cipher
	}
	initCalcCustCiph() // update
}

function initCalcCustCiph(editorOpened = true) {
	document.getElementById("calcOptionsPanel").innerHTML = "" // clear menu panel
	// reinit, create menus
	initCiphers(false) // don't alter default ciphers
	createCalcMenus()
	// update tables
	updateTables() 
	if (editorOpened) checkCustCipherName() // redraw add/update custom cipher button
	if (userDBlive.length !== 0) { // restore controls if live database is loaded
		$("#queryDBbtn").removeClass("hideValue") // display query button
		$("#clearDBqueryBtn").removeClass("hideValue") // clear button
		$("#unloadDBBtn").removeClass("hideValue") // unload database button
		$("#btn-export-db-query").removeClass("hideValue") // export button
		$("#liveDBOption").addClass("hideValue") // hide "Live Database Mode"
	}
}