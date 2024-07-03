// ========================= Local Storage ==========================

function saveCalcSettingsLocalStorage(saveDef = false) {
	var calcSetStr = exportCiphersDB(true) // export all ciphers
	if (!saveDef) {
		window.localStorage.setItem('userCalcSettings', calcSetStr);
		displayCalcNotification("Settings were saved!", 1500)
	} else {
		if (window.localStorage.getItem('defCalcSettings') === null) {
			window.localStorage.setItem('defCalcSettings', calcSetStr);
		}
	}
}

function restoreCalcSettingsLocalStorage(silentMode = false) {
	if (window.localStorage.getItem('userCalcSettings') === null) { 
		if (window.localStorage.getItem('defCalcSettings').length > 0) {
			sItem = "defCalcSettings" // restore default settings if no user settings found
		} else { return }
	} else {
		sItem = "userCalcSettings" // restore user settings
	}
	var file = window.localStorage.getItem(sItem);

	var calcOpt = file.match(/(?<=calcOptions = )[\s\S]*?\]/m) // array values
	if (calcOpt !== null) {
		calcOptMatch = calcOpt[0].replace(/(\t|  +|\r|\n)/g, "") // remove tabs, consequtive spaces, line breaks
		if (isJsonString(calcOptMatch)) importCalcOptions(JSON.parse(calcOptMatch)) // load user options
	}

	var ciph = file.match(/(?<=cipherList = \[)[\s\S]+/m) // match after "cipherList = [" till end of file, multiple line regex - [\s\S]+
	file = ciph[0].replace(/(\t|  +|\r|\n)/g, "").slice(10,-1) // remove tabs, consequtive spaces, line breaks - "new cipher" at start, last bracket
	ciph = file.split(",new cipher") // split string into array

	cipherList = []; cCat = []; defaultCipherArray = [] // clear arrays with previously defined ciphers, categories, default ciphers
	for (n = 0; n < ciph.length; n++) {
		cipherList.push(eval("new cipher("+ciph[n].slice(1,-1)+")")) // remove parethesis, evaluate string as javascript code
	}
	document.getElementById("calcOptionsPanel").innerHTML = "" // clear menu panel
	initCalc() // reinit
	updateTables() // update tables
	updateInterfaceColor(true) // update interface color (first run)
	if (userDBlive.length !== 0) { // restore controls if live database is loaded
		$("#queryDBbtn").removeClass("hideValue") // display query button
		$("#clearDBqueryBtn").removeClass("hideValue") // clear button
		$("#unloadDBBtn").removeClass("hideValue") // unload database button
		$("#btn-export-db-query").removeClass("hideValue") // export button
		$("#liveDBOption").addClass("hideValue") // hide "Live Database Mode"
	}

	if (!silentMode) {
		displayCalcNotification("Settings were restored!", 1500)
	}
	return
}

function clearCalcSettingsLocalStorage() {
	if (window.localStorage.getItem('userCalcSettings') === null) {
		window.localStorage.clear() // clear all localStorage
		displayCalcNotification("localStorage was cleared!", 1500)
		return
	}
	window.localStorage.removeItem('userCalcSettings');
	displayCalcNotification("Settings were cleared!", 1500)
	return
}