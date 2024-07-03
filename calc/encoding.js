// ============================ Encoding ============================

var encodingMode = 0 // 0 - syllables, 1 - use database (1 phrase), 2 - use database (2 phrases)
var encOddLength = false // use odd letters for syllable mode
var encSylMaxPhrases = 10 // max phrases to generate for syllable mode
var encDefAlphArr = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]
var encDefVowArr = ["a","e","i","o","u","y"]
var encDefExcLetArr = ["q","z","j","x"]
var encPrevAlphStr = JSON.stringify(encDefAlphArr).replace(/"/g, "").slice(1,-1) // store previously defined alphabet
var encPrevVowStr = JSON.stringify(encDefVowArr).replace(/"/g, "").slice(1,-1)
var encPrevExcLetStr = JSON.stringify(encDefExcLetArr).replace(/"/g, "").slice(1,-1)

// ==================================================================

function toggleEncodingMenu(updateEncMenu = false, clearValues = false) {
	if (!encodingMenuOpened || updateEncMenu == true) {
		if (!updateEncMenu) closeAllOpenedMenus()
		encodingMenuOpened = true
		document.getElementById('queryDBbtn').disabled = true // disable Query button while menu is open
		if (userDBlive.length == 0) { // allow buttons for syllable mode
			document.getElementById('clearDBqueryBtn').classList.remove("hideValue")
			document.getElementById('btn-export-db-query').classList.remove("hideValue")
		}
		var cur_ciph_index = 0 // index of current of enabled cipher that will be added to the table (total # of ciphers added so far + 1)
		var new_row_opened = false // condition to open new row inside table
		var ciph_in_row = 0 // count ciphers in current row

		var o = '<div class="colorControlsBG">'
		o += '<input class="closeMenuBtn" type="button" value="&#215;" onclick="closeAllOpenedMenus()">'

		o += '<table id="encCipherTable" class="ciphToggleContainer">'
		if (updateEncMenu) o = ''
		o += '<tbody>'
		
		for (i = 0; i < cipherList.length; i++) {
			cur_ciph_index++
			if (!new_row_opened) { // check if new row has to be opened
				o += '<tr>'
				new_row_opened = true
			}
			var chkVal; var chk = "";
			if (ciph_in_row < encodingMenuColumns) { // until number of ciphers in row equals number of columns
				// if (cipherList[i].cArr.indexOf(97) > -1) { // all available English ciphers
				if (cipherList[i].enabled == true) { // for each enabled cipher
					chkVal = (document.getElementById('encCiphVal'+i) !== null) ? document.getElementById('encCiphVal'+i).value : 0
					chkVal = (clearValues) ? 0 : chkVal // clear values
					o += '<td><span class="ciphCheckboxLabel">'+cipherList[i].cipherName+'</span></td>'
					o += '<td><input type="text" value="'+chkVal+'" class="colSlider" id="encCiphVal'+i+'"></td>'
					o += '<td style="min-width: 16px;"></td>'
					ciph_in_row++
				}
			}
			if (ciph_in_row == encodingMenuColumns) { // check if row needs to be closed
				o += '</tr>'
				ciph_in_row = 0 // reset cipher count
				new_row_opened = false
			}
		}
		o += '</tbody>'
		if (updateEncMenu) { document.getElementById('encCipherTable').innerHTML = o; return; } // update available ciphers
		o += '</table>'

		var prevAlphStr = (encPrevAlphStr.length > 0) ? encPrevAlphStr : JSON.stringify(encDefAlphArr).replace(/"/g, "").slice(1,-1)
		var prevVowStr = (encPrevVowStr.length > 0) ? encPrevVowStr : JSON.stringify(encDefVowArr).replace(/"/g, "").slice(1,-1)
		var prevExcStr = (encPrevExcLetStr.length > 0) ? encPrevExcLetStr : JSON.stringify(encDefExcLetArr).replace(/"/g, "").slice(1,-1)

		var SylChkState = (encodingMode == 0) ? " checked" : "";
		var DBChkState = (encodingMode == 1) ? " checked" : "";
		var DBAltChkState = (encodingMode == 2) ? " checked" : "";
		var OddLetChkState = (encOddLength) ? " checked" : "";
		var SylParamChkState = (encodingMode > 0) ? " disabled" : "";

		// controls
		o += '<center>'

		o += '<div style="margin: 1em;"></div>'

		o += '<table class="globColCtrlTable" style="padding: 0em 0em 0em 1em;">'
		o += '<tr>'
		o += '<td><label class="chkLabel colLabelSmallEnc">Use Database (1 phrase)<input type="checkbox" id="chkbox_useDB1Phr" onclick="setEncodingMode(1)"'+DBChkState+'><span class="custChkBox"></span></label></td>'
		o += '<td><label class="chkLabel colLabelSmallEnc">Use Database (2 phrases)<input type="checkbox" id="chkbox_useDB2Phr" onclick="setEncodingMode(2)"'+DBAltChkState+'><span class="custChkBox"></span></label></td>'
		o += '</tr>'
		o += '</table>'

		o += '<div style="margin: 1em;"></div>'

		o += '<table class="globColCtrlTable">'
		o += '<tr>'
		o += '<td><input id="resetEncButton" class="intBtn" type="button" value="Clear Values Only" style="margin: 0em 0.5em; font-size: 75%;" onclick="toggleEncodingMenu(true, true)"></td>'
		o += '<td><input id="resetEncButton" class="intBtn" type="button" value="Reset All Settings" style="margin: 0em 0.5em; font-size: 75%;" onclick="resetEncodingValues()"></td>'
		o += '</tr>'
		o += '</table>'

		o += '<div style="margin: 1em;"></div>'

		o += '<table class="globColCtrlTable">'
		o += '<tr>'
		o += '<td><label class="chkLabel colLabelSmallEnc">Use Syllables<input type="checkbox" id="chkbox_useSylEnc" onclick="setEncodingMode(0)"'+SylChkState+'><span class="custChkBox"></span></label></td>'
		o += '<td><label class="chkLabel colLabelSmallEnc">Odd Length<input type="checkbox" id="chkbox_encOddLength"'+OddLetChkState+SylParamChkState+' onclick="encOddLength = !encOddLength"><span class="custChkBox"></span></label></td>'
		o += '<td><input type="number" step="1" min="0" max="50" value="'+encSylMaxPhrases+'" id="encMaxPhrases" class="colSlider colLabelSmallEnc" style="margin-right: 0.5em;" oninput="encSylMaxPhrases = document.getElementById(&quot;encMaxPhrases&quot;).value"'+SylParamChkState+'><span class="colLabelSmall">Phrases</span></td>'
		o += '</tr>'
		o += '</table>'

		o += '<table class="globColCtrlTable">'
		o += '<tr>'
		o += '<td><span class="colLabelSmall">Alphabet</span></td>'
		o += '<td><input type="text" autocomplete="off" placeholder="a,b,c,d,e,f" value="'+prevAlphStr+'" class="colSlider" id="encAlphabetBox" style="width: 300px;" oninput="encPrevAlphStr = document.getElementById(&quot;encAlphabetBox&quot;).value"'+SylParamChkState+'></td>'
		o += '</tr><tr>'
		o += '<td><span class="colLabelSmall">Vowels</span></td>'
		o += '<td><input type="text" autocomplete="off" placeholder="a,e,i,o,u,y" value="'+prevVowStr+'" class="colSlider" id="encVowelsBox" style="width: 300px;" oninput="encPrevVowStr = document.getElementById(&quot;encVowelsBox&quot;).value"'+SylParamChkState+'></td>'
		o += '</tr><tr>'
		o += '<td><span class="colLabelSmall">Exclude</span></td>'
		o += '<td><input type="text" autocomplete="off" placeholder="q,z,j,x,k,w,v,f" value="'+prevExcStr+'" class="colSlider" id="encExcludeBox" style="width: 300px;" oninput="encPrevExcLetStr = document.getElementById(&quot;encExcludeBox&quot;).value"'+SylParamChkState+'></td>'
		o += '</tr>'
		o += '</table>'

		o += '<div style="margin: 1em;"></div>'

		o += '<table class="globColCtrlTable">'
		o += '<tr>'
		o += '<td><input id="readValEncButton" class="intBtn" type="button" value="Read Values" style="margin: 0em 0.5em; font-size: 75%;" onclick="readEncodingValues()"></td>'
		o += '<td><input id="subtractEncButton" class="intBtn" type="button" value="Subtract Values" style="margin: 0em 0.5em; font-size: 75%;" onclick="subtractEncodingValues()"></td>'
		o += '<td><input id="startEncButton" class="intBtn" type="button" value="Find Phrases" style="margin: 0em 0.5em; font-size: 75%;" onclick="encodeGematria()"></td>'
		o += '</tr>'
		o += '</table>'

		o += '</center>'

		o += '</div>' // colorControlsBG
		document.getElementById("dateCalcMenuArea").innerHTML = o
	} else {
		document.getElementById("dateCalcMenuArea").innerHTML = "" // close Encoding menu
		if (userDBlive.length == 0) {
			document.getElementById('clearDBqueryBtn').classList.add("hideValue")
			document.getElementById('btn-export-db-query').classList.add("hideValue")
		}
		document.getElementById('queryDBbtn').disabled = false // enable Query button
		clearDatabaseQueryTable(); encodingMenuOpened = false
	}
}

function setEncodingMode(val) {
	encodingMode = val
	if (val == 0) {
		document.getElementById('chkbox_useSylEnc').checked = true
		document.getElementById('chkbox_useDB1Phr').checked = false
		document.getElementById('chkbox_useDB2Phr').checked = false
		document.getElementById('chkbox_encOddLength').disabled = false
		document.getElementById('encMaxPhrases').disabled = false
		document.getElementById('encAlphabetBox').disabled = false
		document.getElementById('encVowelsBox').disabled = false
		document.getElementById('encExcludeBox').disabled = false
	} else if (val == 1) {
		document.getElementById('chkbox_useSylEnc').checked = false
		document.getElementById('chkbox_useDB1Phr').checked = true
		document.getElementById('chkbox_useDB2Phr').checked = false
		document.getElementById('chkbox_encOddLength').disabled = true
		document.getElementById('encMaxPhrases').disabled = true
		document.getElementById('encAlphabetBox').disabled = true
		document.getElementById('encVowelsBox').disabled = true
		document.getElementById('encExcludeBox').disabled = true
	} else if (val == 2) {
		document.getElementById('chkbox_useSylEnc').checked = false
		document.getElementById('chkbox_useDB1Phr').checked = false
		document.getElementById('chkbox_useDB2Phr').checked = true
		document.getElementById('chkbox_encOddLength').disabled = true
		document.getElementById('encMaxPhrases').disabled = true
		document.getElementById('encAlphabetBox').disabled = true
		document.getElementById('encVowelsBox').disabled = true
		document.getElementById('encExcludeBox').disabled = true
	}
}

function resetEncodingValues() {
	var i, tmpBox
	setEncodingMode(0)
	encSylMaxPhrases = 10
	document.getElementById('encMaxPhrases').value = 10
	encOddLength = false
	document.getElementById('chkbox_encOddLength').checked = false
	encPrevAlphStr = ""; encPrevVowStr = ""; encPrevExcLetStr = ""
	document.getElementById('encAlphabetBox').value = JSON.stringify(encDefAlphArr).replace(/"/g, "").slice(1,-1)
	document.getElementById('encVowelsBox').value = JSON.stringify(encDefVowArr).replace(/"/g, "").slice(1,-1)
	document.getElementById('encExcludeBox').value = JSON.stringify(encDefExcLetArr).replace(/"/g, "").slice(1,-1)
	for (i = 0; i < cipherList.length; i++) { // reset values
		tmpBox = document.getElementById('encCiphVal'+i)
		if (tmpBox !== null) tmpBox.value = "0"
	}
}

function subtractEncodingValues() {
	var i, elmt
	for (i = 0; i < cipherList.length; i++) {
		elmt = document.getElementById('encCiphVal'+i)
		if (elmt !== null) { // read value from encoding menu if available
			elmt.value = elmt.value - cipherList[i].calcGematria(sVal()) // gematria of text inside phrase box
		}
	}
	phraseBoxKeypress(46) // clear box
}

function readEncodingValues() {
	var i, elmt
	for (i = 0; i < cipherList.length; i++) {
		elmt = document.getElementById('encCiphVal'+i)
		if (elmt !== null && cipherList[i].enabled) { // if element exists and cipher is enabled
			elmt.value = cipherList[i].calcGematria(sVal()) // get gematria of phrase box for that cipher
		}
	}
	phraseBoxKeypress(46) // clear box
}

function displayEncodingResults() {
	$("#calcMain").addClass("splitInterface") // split screen

	if (document.getElementById("queryArea") == null) { // create div if it doesn't exist
		var o = '<div id="queryArea"></div>'
		$(o).appendTo('body');
	}

	gemArr = []; gemArrCiph = []
	for (i = 0; i < cipherList.length; i++) {
		if (cipherList[i].enabled) {
			curEncCiphVal = document.getElementById("encCiphVal"+i).value
			gemArr.push(curEncCiphVal) // load values from encoder for enabled ciphers
			gemArrCiph.push(i) // indices of enabled ciphers
		}
	}

	var tWidth = 202 + 58*gemArrCiph.length // 2x1px outer borders + phrase cell and amount of ciphers
	$("#queryArea").css("min-width", tWidth) // set initial/minimal width for the table
	$("#queryArea").css("width", tWidth) // set initial/minimal width for the table
	updateDatabaseQueryTable(0,dbPageItems)
}

// ==================================================================

function calcEncMatchProb(nOfMatches, dbSize, halfSize = true) { // calculate match probability
	var dbPairs = (halfSize) ? (1 + dbSize) * dbSize / 2 : dbSize * dbSize // number of paired phrases
	var prob = (nOfMatches / dbPairs).toFixed(8)
	return nOfMatches+'/'+dbPairs+' combinations; '+prob+'%'
}

function getRandomInt(max) { // for 3 -> 0, 1 or 2
	return Math.floor(Math.random() * Math.floor(max));
}

function encodeGematria(n_phr, encCiphValsArr, encCiphIndArr, exclude = []) {
	var i, n, encDB, solution
	queryResult = []
	queryResultInitial = []

	if (encodingMode == 0) { // use syllables

		if (document.getElementById("encMaxPhrases") !== null) {
			n_phr = document.getElementById("encMaxPhrases").value // element exists
		}

		// encCiphValsArr, encCiphIndArr
		encCiphValsArr = []; encCiphIndArr = []
		for (i = 0; i < cipherList.length; i++) {
			curEncCiphVal = document.getElementById("encCiphVal"+i)
			if (curEncCiphVal !== null && curEncCiphVal.value !== '0') { // if element exists, non zero value
				encCiphIndArr.push(i) // add cipher index
				curVal = (curEncCiphVal.value == "-0") ? 0 : curEncCiphVal.value // use '-0' to match to zero
				encCiphValsArr.push(Number(curEncCiphVal.value)) // add cipher value
			}
		}

		if (encCiphIndArr.length == 0) return // no values were specified

		// exclude letters
		if (document.getElementById('encExcludeBox') !== null) { // exclude letters
			encPrevExcLetStr = document.getElementById('encExcludeBox').value.replace(/ /g, '').split(',')
		}
		encodingInitSyllables() // build syllables

		// find solutions
		for (i = 0; i < n_phr; i++) {
			solution = encodingFindSylMatch(encCiphValsArr, encCiphIndArr)
			solution = (optGemSubstitutionMode) ? solution.trim()+' [<a href="https://new.wordsmith.org/anagram/anagram.cgi?anagram='+solution.trim()+'&language=english&t=0&d=3&include=&exclude=&n=&m=&a=n&l=n&q=n&k=1&source=adv" target="_blank" rel="noopener noreferrer nofollow">anagram</a>]' : solution.trim()
			queryResult.push(solution) // add phrase, remove spaces
		}
		queryResultInitial = [...queryResult] // save matches
		displayEncodingResults()
		return
	}

	if (encodingMode == 1) { // use live database for matching (1 phrase)

		if (userDBlive.length == 0) {
			displayCalcNotification("Live Database is not loaded!", 2500)
			return
		}

		encDB = [] // use database without comments
		for (i = 0; i < userDBlive.length; i++) encDB.push(userDBlive[i].replace(/\[.+\]/g, '').trim())

		// prepare arrays with cipher indices and values to be matched
		var encCiphValsArr = []; var encCiphIndArr = []; var curVal
		for (i = 0; i < cipherList.length; i++) {
			curEncCiphVal = document.getElementById("encCiphVal"+i)
			if (curEncCiphVal !== null && curEncCiphVal.value !== '0') { // if element exists, non zero value
				encCiphIndArr.push(i) // add cipher index
				curVal = (curEncCiphVal.value == "-0") ? 0 : curEncCiphVal.value // use '-0' to match to zero
				encCiphValsArr.push(Number(curEncCiphVal.value)) // add cipher value
			}
		}

		if (encCiphIndArr.length == 0) return // no values were specified

		var word = sVal() // value in phrase box
		var wordDisp = word.split(';') // split phrase to insert in different positions
		while (wordDisp.length < 2) wordDisp.push('') // min length of 2
		wordDisp.slice(0,2) // leave 2 items (start, length)
		word = (wordDisp[0]+' ... '+wordDisp[1]).trim() // not used for calculation

		var tmpPhr; var phrCount = 0
		dbPhrase:
		for (i = 0; i < encDB.length; i++) { // for each line in live database
			tmpPhr = wordDisp[0]+' '+encDB[i]+' '+wordDisp[1] // "start;end" -> "start phrase end"
			for (n = 0; n < encCiphIndArr.length; n++) { // for each specified cipher
				if ( cipherList[encCiphIndArr[n]].calcGematria(tmpPhr) !== encCiphValsArr[n]) continue dbPhrase // if phrase doesn't match value try next DB item
			}
			/*console.log(word+' '+tmpPhr[0]+'\n'+
				'encCiphIndArr: '+JSON.stringify(encCiphIndArr)+'\n'+
				'encCiphValsArr: '+JSON.stringify(encCiphValsArr)+'\n'+
				'tmpPhr: '+JSON.stringify(tmpPhr)+'\n'
			)*/
			queryResult.push(tmpPhr.trim()) // add phrase, remove spaces (start, end)
			phrCount++
		}

		var o = ''
		for (n = 0; n < encCiphIndArr.length; n++) {
			o += encCiphValsArr[n] + ' ' + cipherList[encCiphIndArr[n]].cipherName + '\n'
		}
		o += '    ' + phrCount + ' results (Phrase Box: "' + word + '")'
		console.log(o)

		displayCalcNotification(phrCount+" results", 2500)

		queryResultInitial = [...queryResult] // save matches
		displayEncodingResults()
		return
	}

	if (encodingMode == 2) { // use live database for matching (2 phrases)

		if (userDBlive.length == 0) {
			displayCalcNotification("Live Database is not loaded!", 2500)
			return
		}

		encDB = [] // use live database without comments
		for (i = 0; i < userDBlive.length; i++) encDB.push(userDBlive[i].replace(/\[.+\]/g, '').trim())

		// prepare arrays with cipher indices and values to be matched
		var encCiphValsArr = ['-']; var encCiphIndArr = []
		for (i = 0; i < cipherList.length; i++) {
			curEncCiphVal = document.getElementById("encCiphVal"+i)
			if (curEncCiphVal !== null && curEncCiphVal.value !== '0') { // if element exists, non zero value
				encCiphIndArr.push(i) // add cipher index
				curVal = (curEncCiphVal.value == "-0") ? 0 : curEncCiphVal.value // use '-0' to match to zero
				encCiphValsArr.push(Number(curEncCiphVal.value)) // add cipher value
			}
		}

		if (encCiphIndArr.length == 0) return

		const negValMode = (() => { // allow temporary phrase value to exceed final value
			var i, n;
			for (i = 0; i < encCiphIndArr.length; i++) { // for specified ciphers
				for (n = 0; n < cipherList[encCiphIndArr[i]].vArr.length; n++) { // if any cipher has negative values
					if (cipherList[encCiphIndArr[i]].vArr[n] < 0) return true // const is true
				}
			}
			return false // no negative value ciphers
		})();

		var word = sVal() // value in phrase box
		var wordDisp = word.split(';') // split phrase to insert in different positions
		while (wordDisp.length < 3) wordDisp.push('') // min length of 3
		wordDisp.slice(0,3)
		word = (wordDisp[0]+' '+wordDisp[1]+' '+wordDisp[2]).trim() // leave 3 items (beginning, middle, end)

		// calculate live database only for matched ciphers
		var tmpArr = []
		userDB = [] // reset database values

		if (negValMode) { // calculate final value only then return (no performance optimizations)
			var p; var phrCount = 0
			if (optGemSubstitutionMode) {
				for (i = 0; i < encDB.length; i++) { // for each phrase in database
					secondPhraseNS:
					for (p = i; p < encDB.length; p++) { // second phrase from database (next only)
						for (n = 1; n < encCiphValsArr.length; n++) {
							if (cipherList[encCiphIndArr[n-1]].calcGematria(wordDisp[0] + encDB[i] + wordDisp[1] + encDB[p] + wordDisp[2]) == encCiphValsArr[n]) { // exact match
								// keep checking values for other ciphers
							} else {
								continue secondPhraseNS // try next second phrase
							}
						}
						queryResult.push((wordDisp[0]+' '+encDB[i]+' '+wordDisp[1]+' '+encDB[p]+' '+wordDisp[2]).trim().replace(/ +/g, ' ')) // exact match, add phrase (phrase box, first phrase, second phrase)
						phrCount++
					}
				}
			} else { // multiplicative mode, no n/2 optimization
				var p; var phrCount = 0
				for (i = 0; i < encDB.length; i++) { // for each phrase in database
					secondPhraseNM:
					for (p = 0; p < encDB.length; p++) { // second phrase from database
						for (n = 1; n < encCiphValsArr.length; n++) {
							if (cipherList[encCiphIndArr[n-1]].calcGematria(wordDisp[0] + encDB[i] + wordDisp[1] + encDB[p] + wordDisp[2]) == encCiphValsArr[n]) { // exact match
								// keep checking values for other ciphers
							} else {
								continue secondPhraseNM // try next second phrase
							}
						}
						queryResult.push((wordDisp[0]+' '+encDB[i]+' '+wordDisp[1]+' '+encDB[p]+' '+wordDisp[2]).trim().replace(/ +/g, ' ')) // exact match, add phrase (phrase box, first phrase, second phrase)
						phrCount++
					}
				}
			}

			var o = ''
			for (n = 0; n < encCiphIndArr.length; n++) {
				o += encCiphValsArr[n+1] + ' ' + cipherList[encCiphIndArr[n]].cipherName + '\n'
			}
			o += '    ' + phrCount + ' results (Phrase Box: "' + word + '"; ' + calcEncMatchProb(phrCount, userDBlive.length, false) + ')'
			console.log(o)

			displayCalcNotification(phrCount+" results", 2500)

			queryResultInitial = [...queryResult] // save matches
			displayEncodingResults()
			return // ignore the code below
		}

		if (optGemSubstitutionMode || wordDisp[0] == "") { // if substitution mode or first manual word not defined
			for (i = 0; i < encDB.length; i++) {
				tmpArr = [] // reset
				tmpArr.push(encDB[i]) // add phrase
				for (n = 0; n < encCiphIndArr.length; n++) { // for each matched cipher
					tmpArr.push(cipherList[encCiphIndArr[n]].calcGematria(encDB[i])) // calculate gematria value
				}
				userDB.push(tmpArr) // add row with phrase and gematria for enabled ciphers
			}
			var wordGemArr = [word] // calculate phrase box value (substitution mode only)
			for (i = 0; i < encCiphIndArr.length; i++) {
				wordGemArr.push( cipherList[encCiphIndArr[i]].calcGematria(word) )  // ["encoding", 71, 44]
			}
		}

		if (optGemSubstitutionMode) {
			var curGem, curGem2, p; var phrCount = 0
			firstPhrase:
			for (i = 0; i < userDB.length; i++) { // for each phrase in database
				curGem = [...userDB[i]] // load gematria of phrase
				for (n = 1; n < wordGemArr.length; n++) {
					if (curGem[n] + wordGemArr[n] < encCiphValsArr[n]) { // if total is less than matched value
						curGem[n] += wordGemArr[n] // add gematria of phrase box to current phrase for each matched cipher
					} else {
						continue firstPhrase // mismatch, check next phrase
					}
				}
				secondPhrase:
				for (p = i; p < userDB.length; p++) { // for each next phrase in database (total of two phrases)
					curGem2 = [...curGem] // copy of first phrase + phrase box gematria
					for (n = 1; n < userDB[p].length; n++) { // for all gematria values for that phrase
						if (curGem2[n] + userDB[p][n] == encCiphValsArr[n]) { // if total is equal to matched value
							curGem2[n] += userDB[p][n] // add gematria of 2nd phrase to current gematria array
						} else {
							continue secondPhrase // mismatch, check next 2nd phrase
						}
					}
					queryResult.push((wordDisp[0]+' '+curGem[0]+' '+wordDisp[1]+' '+userDB[p][0]+' '+wordDisp[2]).trim().replace(/ +/g, ' ')) // exact match, add phrase (phrase box, first phrase, second phrase)
					phrCount++
				}
			}
		} else if (!optGemSubstitutionMode && wordDisp[0] == "") { // multiplication mode, first manual word not defined
			var p; var phrCount = 0
			firstStep:
			for (i = 0; i < userDB.length; i++) { // for each phrase in database
				for (n = 1; n < encCiphValsArr.length; n++) {
					if (userDB[i][n] < encCiphValsArr[n]) {
						// just continue if first phrase is less that matched value
					} else {
						continue firstStep // start with a different word
					}
				}
				if (wordDisp[1] !== "") { // if second manual word is not empty
					for (n = 1; n < encCiphValsArr.length; n++) {
						if (cipherList[encCiphIndArr[n-1]].calcGematria(userDB[i][0] + wordDisp[1]) < encCiphValsArr[n]) {
							// just continue if phrase is less that matched value
						} else {
							continue firstStep // next word
						}
					}
				}
				secondStep:
				for (p = 0; p < userDB.length; p++) { // second phrase from database
					for (n = 1; n < encCiphValsArr.length; n++) {
						if (cipherList[encCiphIndArr[n-1]].calcGematria(userDB[i][0] + wordDisp[1] + userDB[p][0] + wordDisp[2]) == encCiphValsArr[n]) { // exact match
							// just continue if first phrase is less that matched value
						} else {
							continue secondStep // start with a different second phrase
						}
					}
					queryResult.push((wordDisp[0]+' '+userDB[i][0]+' '+wordDisp[1]+' '+userDB[p][0]+' '+wordDisp[2]).trim().replace(/ +/g, ' ')) // exact match, add phrase (phrase box, first phrase, second phrase)
					phrCount++
				}
			}
		} else if (!optGemSubstitutionMode && wordDisp[0] !== "") { // multiplication mode, first manual word defined
			var p; var phrCount = 0
			firstStepF:
			for (i = 0; i < encDB.length; i++) { // for each phrase in database
				for (n = 1; n < encCiphValsArr.length; n++) {
					if (cipherList[encCiphIndArr[n-1]].calcGematria(wordDisp[0] + encDB[i]) < encCiphValsArr[n]) {
						// just continue if first phrase is less that matched value
					} else {
						continue firstStepF // start with a different word
					}
				}
				secondStepF:
				for (p = 0; p < encDB.length; p++) { // second phrase from database
					for (n = 1; n < encCiphValsArr.length; n++) {
						if (cipherList[encCiphIndArr[n-1]].calcGematria(wordDisp[0] + encDB[i] + wordDisp[1] + encDB[p] + wordDisp[2]) == encCiphValsArr[n]) { // exact match
							// just continue if first phrase is less that matched value
						} else {
							continue secondStepF // start with a different second phrase
						}
					}
					queryResult.push((wordDisp[0]+' '+encDB[i]+' '+wordDisp[1]+' '+encDB[p]+' '+wordDisp[2]).trim().replace(/ +/g, ' ')) // exact match, add phrase (phrase box, first phrase, second phrase)
					phrCount++
				}
			}
		}

		var o = ''
		for (n = 0; n < encCiphIndArr.length; n++) {
			o += encCiphValsArr[n+1] + ' ' + cipherList[encCiphIndArr[n]].cipherName + '\n'
		}
		o += (optGemSubstitutionMode) ? '    ' + phrCount + ' results (Phrase Box: "' + word + '"; ' + calcEncMatchProb(phrCount, userDB.length) + ')' : '    ' + phrCount + ' results (Phrase Box: "' + word + '"; ' + calcEncMatchProb(phrCount, userDBlive.length, false) + ')'
		console.log(o)

		displayCalcNotification(phrCount+" results", 2500)

		queryResultInitial = [...queryResult] // save matches
		displayEncodingResults()
		return
	}
}

// =========================== Syllables ============================

var encAllSyl = []; var encConSyl = []; var encVowSyl = []; var alph = [];

function encodingInitSyllables() {

	alph = document.getElementById("encAlphabetBox").value.split(',')
	var vowels = document.getElementById("encVowelsBox").value.split(',')
	var cons = []; for (var i = 0; i < alph.length; i++) { if (vowels.indexOf(alph[i]) == -1) { cons.push(alph[i]) } }

	for (i = 0; i < encPrevExcLetStr.length; i++) {
		if (alph.indexOf(encPrevExcLetStr[i]) > -1) alph.splice(alph.indexOf(encPrevExcLetStr[i]),1)
		if (cons.indexOf(encPrevExcLetStr[i]) > -1) cons.splice(cons.indexOf(encPrevExcLetStr[i]),1)
		if (vowels.indexOf(encPrevExcLetStr[i]) > -1) vowels.splice(vowels.indexOf(encPrevExcLetStr[i]),1)
	}
	// console.log("vowels:"+vowels.length+" consonants:"+cons.length+" alphabet:"+alph.length)

	var syl = "" // syllable

	encVowSyl = [] // vowel syllables
	encConSyl = [] // consonant syllables
	var encStartVowSyl = [] // starts with vowel syllables

	for (var v = 0; v < vowels.length; v++) {
		for (a = 0; a < alph.length; a++) {
			//syl += vowels[v]+alph[a]+"\n"
			syl = vowels[v]+alph[a]
			if (encVowSyl.indexOf(syl) == -1) encVowSyl.push(syl) // push if not found
		}
		for (a = 0; a < alph.length; a++) {
			//syl += alph[a]+vowels[v]+"\n"
			syl = alph[a]+vowels[v]
			if (encVowSyl.indexOf(syl) == -1) encVowSyl.push(syl) // push if not found
		}
	}
	 
	// exclude "uu", "yy", total of 274
	if (encVowSyl.indexOf("uu") > -1) encVowSyl.splice(encVowSyl.indexOf("uu"),1)
	if (encVowSyl.indexOf("yy") > -1) encVowSyl.splice(encVowSyl.indexOf("yy"),1)

	//console.log(encVowSyl)

	for (var v = 0; v < vowels.length; v++) {
		for (a = 0; a < alph.length; a++) {
			//syl += vowels[v]+alph[a]+"\n"
			syl = vowels[v]+alph[a]
			if (encStartVowSyl.indexOf(syl) == -1) encStartVowSyl.push(syl) // push if not found
		}
	}
	// exclude "uu", "yy", total of 154
	if (encVowSyl.indexOf("uu") > -1) encStartVowSyl.splice(encVowSyl.indexOf("uu"),1)
	if (encVowSyl.indexOf("yy") > -1) encStartVowSyl.splice(encVowSyl.indexOf("yy"),1)

	//console.log(encStartVowSyl)
	//copy(JSON.stringify(encVowSyl).replace(/","/g, "\n"))

	for (var c = 0; c < cons.length; c++) {
		for (c2 = 0; c2 < cons.length; c2++) {
			syl = cons[c]+cons[c2]
			encConSyl.push(syl)
		}
	}
	// total of 400

	//copy(JSON.stringify(encConSyl).replace(/","/g, "\n"))

	encAllSyl = []
	for (i = 0; i < encVowSyl.length; i++) {
		encAllSyl.push(encVowSyl[i]) // add more weight
		encAllSyl.push(encVowSyl[i])
		encAllSyl.push(encVowSyl[i])
		encAllSyl.push(encVowSyl[i])
	}
	for (i = 0; i < encConSyl.length; i++) {
		encAllSyl.push(encConSyl[i])
	}
}

function encodingFindSylMatch(encCiphValsArr, encCiphIndArr, encSylLimitSteps = 1000000, encSylLenLimit = 50) {
	var i
	var word = sVal()+" " // value in phrase box
	if (encOddLength) {
		if (word.length == 1) word.trim() // trim spaces 
		word += alph[Math.floor(Math.random() * alph.length)] // random alphabet letter
	}
	var prev_syl = "" // previous syllable
	var first_syl = true
	var valid_match = true
	var n_count = 0 // iterations

	while (n_count < encSylLimitSteps) {
		prev_syl = word.substring(word.length-2,word.length) // previous syllable
					
		// first syllable
		if (first_syl) {
			word += encAllSyl[getRandomInt(encAllSyl.length)] // any syllable
			first_syl = false
		}
		// ends in 2 consonants, not first syllable
		else if (encConSyl.indexOf(prev_syl) > -1 && !first_syl) { // st -> stea, stem, stre
			word += encVowSyl[getRandomInt(encVowSyl.length)] // vowel syllable
		}
		// doesn't end in two consonants, not first syllable
		else if (encConSyl.indexOf(prev_syl) == -1 && !first_syl) { // sa -> sach, sami, said, sayo
			word += encAllSyl[getRandomInt(encAllSyl.length)] // any syllable
		}

		valid_match = true
		curGem = 0
		for (i = 0; i < encCiphValsArr.length; i++) {
			curGem = cipherList[encCiphIndArr[i]].calcGematria(word)
			if (curGem < encCiphValsArr[i] && word.length <= encSylLenLimit) { // simple calculation
				valid_match = false // continue building word
			} else if (curGem > encCiphValsArr[i] || word.length > encSylLenLimit) { // reset word
				valid_match = false
				var word = sVal()+" " // value in phrase box
				if (encOddLength) {
					if (word.length == 1) word.trim() // trim spaces 
					word += alph[Math.floor(Math.random() * alph.length)] // random alphabet letter
				}
				first_syl = true
				n_count++
				break
			}
		}
		if (valid_match) {
			n_count++
			console.log(word+" ("+n_count+' iterations)')
			return word
		}
	}
	displayCalcNotification('No matches were found after '+encSylLimitSteps.toLocaleString('en')+' steps!', 2500)
	
	return null
}