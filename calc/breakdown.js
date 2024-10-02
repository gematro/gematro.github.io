// ================= Word Breakdown & Cipher Chart ==================

function getSum(total, num) { // used to .reduce() array, adds all values
    return total + num
}

function getSumStr(a) { // used to .reduce() array, adds all values as string, no error on empty array
	var s="";for(let i=0;i<a.length;i++){s+=a[i]}return s.trim()
}

function gemCalcModeLabel(curCipher) {
	var cond = (!curCipher.multiCharacter && !curCipher.wheelCipher && curCipher.LetterCount > 0)
	if (cond && optGemMultCharPos) return ' - x1 ... x'+curCipher.LetterCount
	else if (cond && optGemMultCharPosReverse ) return ' - x'+curCipher.LetterCount+' ... x1'
	return ""
}

function updateWordBreakdown(impName = breakCipher, impBool = false, chartUpd = true) { // false - preview temporary (hover), true - lock breakdown to a specific cipher
	var x, curCipher, curCiphCol, cSpot
	var o, oo, acw, acl

	updateEnabledCipherCount()
	$("#BreakTableContainer").removeClass("hideValue") // unhide breakdown
	$("#BreakdownDetails").attr("style", "") // reset padding (gematria card)

	if (impBool == true) breakCipher = impName // lock to a specific cipher
		
	if (!optShowCipherChart) $("#ChartSpot").attr("style", "border: none;"); // reset gradient for cipher chart
	if (enabledCiphCount == 0 || breakCipher == "" && impName == "") {
		document.getElementById("BreakdownSpot").innerHTML = ""
		document.getElementById("ChartSpot").innerHTML = ""
		$("#ChartSpot").attr("style", "border: none;"); // reset gradient for cipher chart
		return;
	}

	for (x = 0; x < cipherList.length; x++) {
		if (cipherList[x].cipherName == impName) {
			cSpot = x
			if (chartUpd) updateCipherChart(cipherList[x])
			break
		}
	}
	curCipher = cipherList[cSpot]
	curCiphCol = (optColoredCiphers) ? 'color: hsl('+curCipher.H+' '+curCipher.S+'% '+curCipher.L+'% / 1)' : ''
	curGradCol = (optColoredCiphers) ? 'hsl('+curCipher.H+' '+curCipher.S+'% '+curCipher.L+'% / 0.2)' : 'hsl(0 0% 0% / 0.1)'

	var leftToRightBreak = true
 	// if Hebrew Aleph is assigned in current cipher
	if (curCipher.cArr.indexOf(1488) > -1) {
		curCipher.calcBreakdown(sVal().replace(/[\u0591-\u05BD\u05BF-\u05C7]/g,"")) // remove Hebrew vowels, exclude dash
	}
 	// if Arabic Alef is assigned in current cipher
	if (curCipher.cArr.indexOf(1575) > -1) {
		curCipher.calcBreakdown(sVal().replace(/[\u0600-\u061F\u0640\u064B-\u066D\u06D4\u06D6-\u06ED\u06F0-\u06F9]/g,"")) // remove Arabic marks and non letter characters
	}
	// use right to left writing (Hebrew, Arabic) - syllable mode is always left to right
	if ( (curCipher.cArr.indexOf(1488) > -1 || curCipher.cArr.indexOf(1575) > -1) && !curCipher.multiCharacter && !curCipher.wheelCipher) {
		curCipher.cp.reverse(); curCipher.cv.reverse(); curCipher.sumArr.reverse() // right-to-left direction
		if (curCipher.WordCount > 1) {
			curCipher.cp.push(curCipher.cp.shift()) // remove first element and add to the end of array (space, used for word sum)
			curCipher.cv.push(curCipher.cv.shift())
		}
		leftToRightBreak = false
	} else { // left to right, use regular word breakdown
		curCipher.calcBreakdown(sVal()) // calculate breakdown for current phrase
	}

	if (curCipher.sumArr.length > 0) {
		
		var oStart = ''; var o ='';

		var RTLclass = '';
		if (!leftToRightBreak) RTLclass = 'BreakRTL' // use different container padding for right to left direction

		if (optLetterWordCount == true) {
			if (curCipher.LetterCount > 1 || curCipher.LetterCount == 0) {
				acl = curCipher.multiCharacter ? " tokens, " : " letters, "
			} else {
				acl = curCipher.multiCharacter ? " token, " : " letter, "
			}
			if (curCipher.WordCount > 1) {acw = " words"} else {acw = " word"}
			oStart += '<div class="LetterCounts">' + curCipher.LetterCount + acl + curCipher.WordCount + acw + '</div>'
		}

		if (optCompactBreakdown == true) {
			var simplePhr = ""
			if (optAllowPhraseComments) {
				simplePhr = sValNoComments() // exclude text inside [...]
			} else {
				simplePhr = sVal() // display full phrase
			}
			oStart += '<div id="SimpleBreak">'
			oStart += '<span class="breakPhrase">' + simplePhr + '</span><span class="breakPhrase"> = </span><span class="breakSum">'
			if (curCipher.wheelCipher) {
				oStart += curCipher.multiCharacter ? getSumStr(curCipher.sv) :
					getSumStr(curCipher.cv) // add all values in array
			} else {
				oStart += curCipher.sumArr.reduce(getSum) // add all values in array
			}
			oStart += ' </span><span class="breakCipher"><font style="'+curCiphCol+'"> (' + curCipher.cipherName + gemCalcModeLabel(curCipher) + ')</font></span>'
		}

		var curCiphercp = curCipher.multiCharacter ? curCipher.sp : curCipher.cp
		var curCiphercv = curCipher.multiCharacter ? curCipher.sv : curCipher.cv

		if (optWordBreakdown == true && !calcLongBreakdownWidth(curCipher) ) { // character limit, calculated even if out of screen bounds
			var tdCount = 0; var wCount = 0;

			o += '</div><div id="BreakTableContainer" class="'+RTLclass+'"><table class="BreakTable">'
			o += '<tbody><tr>'

			if (leftToRightBreak) { // left to right
				for (x = 0; x < curCiphercp.length; x++) {
					if (curCiphercp[x] !== " ") {
						if (String(curCiphercp[x]).substring(0, 3) == "num") {
							o += '<td class="BreakChar" style="'+curCiphCol+'">' + curCiphercp[x].substring(3, curCiphercp[x].length) + '</td>'
						} else {
							o += curCipher.multiCharacter ? '<td class="BreakChar" style="'+curCiphCol+'">' + curCiphercp[x] + '</td>' :
							'<td class="BreakChar" style="'+curCiphCol+'">' + String.fromCodePoint(curCiphercp[x]) + '</td>'
						}
					} else {
						o += curCipher.wheelCipher ? '<td class="BreakWordSum" rowspan="2" style="padding:0em;"></td>' : '<td class="BreakWordSum" rowspan="2">' + curCipher.sumArr[wCount] + '</td>'
						wCount++
					}
					tdCount++
				}
				o += curCipher.wheelCipher ? '' :
					'<td class="BreakPhraseSum" rowspan="2"><font style="'+curCiphCol+'">' + curCipher.sumArr.reduce(getSum) + '</font></td>'
				o += '</tr><tr>'
				tdCount++
				for (z = 0; z < x; z++) {
					if (curCiphercv[z] !== " ") {
						o += '<td class="BreakVal">' + curCiphercv[z] + '</td>'
					}
				}
			} else { // right to left (Hebrew, Arabic)
				o += '<td class="BreakPhraseSum" rowspan="2"><font style="'+curCiphCol+'">' + curCipher.sumArr.reduce(getSum) + '</font></td>'
				var curBreakWord = '' // current word, added to main 'o' string
				for (x = 0; x < curCiphercp.length; x++) {
					if (curCiphercp[x] !== " ") {
						if (String(curCiphercp[x]).substring(0, 3) == "num") {
							curBreakWord += '<td class="BreakChar" style="'+curCiphCol+'">' + curCiphercp[x].substring(3, curCiphercp[x].length) + '</td>'
						} else {
							curBreakWord += '<td class="BreakChar" style="'+curCiphCol+'">' + String.fromCodePoint(curCiphercp[x]) + '</td>'
						}
					} else {
						curBreakWord = '<td class="BreakWordSum" rowspan="2">' + curCipher.sumArr[wCount] + '</td>' + curBreakWord // prepend word sum (displayed on the left)
						o += curBreakWord
						curBreakWord = ''
						wCount++
					}
					tdCount++
				}
				if (curCipher.WordCount == 1) o += curBreakWord // single word
				o += '</tr><tr>'
				tdCount++
				for (z = 0; z < x; z++) {
					if (curCiphercv[z] !== " ") {
						o += '<td class="BreakVal">' + curCiphercv[z] + '</td>'
					}
				}
			}
			ciphEndClass = (leftToRightBreak) ? "CipherEnd" : "CipherEndRTL"
			if (optCompactBreakdown == true) o += '</tr><tr><td colspan=' + tdCount + ' class="'+ciphEndClass+'"><font style="'+curCiphCol+'">' + curCipher.cipherName + gemCalcModeLabel(curCipher) + '</font></td></tr></table></div>'
			else o += '</tr></tbody></table></div>'

			o = oStart + o // prepend phrase, word/letter count

		} else if (optWordBreakdown == true && calcLongBreakdownWidth(curCipher)) { // breakdown for long phrases

			var wrdCount = 0; var z = 0;
			var breakArr = buildLongBreakdown(curCipher) // index of word in phraseBox, used to mark table end
			var curBreakRow = '' // current row, added to main 'o' string

			if (leftToRightBreak) { // left to right
				curBreakRow = '<table class="BreakTableRow" style="padding-top: 0.5em;"><tbody><tr>'
				for (x = 0; x < curCiphercp.length; x++) {
					if (curCiphercp[x] !== " ") {
						if (String(curCiphercp[x]).substring(0, 3) == "num") {
							curBreakRow += '<td class="BreakChar">' + curCiphercp[x].substring(3, curCiphercp[x].length) + '</td>'
						} else {
							curBreakRow += curCipher.multiCharacter ? '<td class="BreakChar">' + curCiphercp[x] + '</td>' :
							'<td class="BreakChar">' + String.fromCodePoint(curCiphercp[x]) + '</td>'
						}
					} else { // show character values and word sum if space
						curBreakRow += curCipher.wheelCipher ? '<td class="BreakWordSum" rowspan="2" style="padding:0em;"></td>' :
							'<td class="BreakWordSum" rowspan="2"><font style="'+curCiphCol+'">' + curCipher.sumArr[wrdCount] + '</font></td>'
						if (breakArr.indexOf(wrdCount) > -1 || wrdCount == curCipher.WordCount-1) { // include values for last word
							curBreakRow += '</tr><tr>'
							for (z; z < x; z++) {
								if (curCiphercv[z] !== " ") {
									curBreakRow += '<td class="BreakValDark">' + curCiphercv[z] + '</td>'
								}
							}
							curBreakRow += '</tr></tbody></table>'
							if (wrdCount !== curCipher.WordCount-1) curBreakRow += '<table class="BreakTableRow"><tbody><tr>'
						}
						wrdCount++
					}
				}
				if (curCiphercp.indexOf(" ") == -1) { // show character values if one long word (has no " ")
					curBreakRow += '</tr><tr>'
					for (z; z < x; z++) {
						if (curCiphercv[z] !== " ") {
							curBreakRow += '<td class="BreakValDark">' + curCiphercv[z] + '</td>'
						}
					}
					curBreakRow += '</tr></tbody></table>'
				}
				o = '</div><div id="BreakTableContainer" class="'+RTLclass+'">' + curBreakRow
			} else { // right to left (Hebrew, Arabic)
				curBreakRow = '<table class="BreakTableRow"><tbody><tr>'
				if (curCipher.WordCount > 1) curBreakRow += '<td class="BreakWordSum" rowspan="2"><font style="'+curCiphCol+'">' + curCipher.sumArr[wrdCount] + '</font></td>'
				for (x = 0; x < curCiphercp.length; x++) {
					if (curCiphercp[x] !== " ") {
						if (String(curCiphercp[x]).substring(0, 3) == "num") {
							curBreakRow += '<td class="BreakChar">' + curCiphercp[x].substring(3, curCiphercp[x].length) + '</td>'
						} else {
							curBreakRow += '<td class="BreakChar">' + String.fromCodePoint(curCiphercp[x]) + '</td>'
						}
					} else { // show character values and word sum if space or last character
						if (breakArr.indexOf(wrdCount) > -1 || wrdCount == curCipher.WordCount-1) { // include values for last word
							curBreakRow += '</tr><tr>'
							for (z; z < x; z++) {
								if (curCiphercv[z] !== " ") {
									curBreakRow += '<td class="BreakValDark">' + curCiphercv[z] + '</td>'
								}
							}
							curBreakRow += '</tr></tbody></table>'
							o = curBreakRow + o // prepend current row to main table
							if (wrdCount !== curCipher.WordCount-1) curBreakRow = '<table class="BreakTableRow"><tbody><tr>'
						}
						wrdCount++
						if (wrdCount !== curCipher.WordCount) curBreakRow += '<td class="BreakWordSum" rowspan="2"><font style="'+curCiphCol+'">' + curCipher.sumArr[wrdCount] + '</font></td>'
					}
				}
				if (curCiphercp.indexOf(" ") == -1) { // show character values if one long word (has no " ")
					curBreakRow += '</tr><tr>'
					for (z; z < x; z++) {
						if (curCiphercv[z] !== " ") {
							curBreakRow += '<td class="BreakValDark">' + curCiphercv[z] + '</td>'
						}
					}
					curBreakRow += '</tr></tbody></table>'
					o = curBreakRow + o // prepend current row to main table
				}
				o = '</div><div id="BreakTableContainer" class="'+RTLclass+'"><div style="padding: 0.25em"></div>' + o // prepend opening div, include padding
			}
			o = oStart + o // prepend phrase, word/letter count
			if (optCompactBreakdown == true) {
				o += '<div id="BreakSumLong"><span class="breakSumDark">'
				o += curCipher.wheelCipher ? '' : curCipher.sumArr.reduce(getSum)
				o += ' </span>'
				o += '<span class="breakCipher" style="'+curCiphCol+'">' + curCipher.cipherName + gemCalcModeLabel(curCipher) + '</span></div></div>'
			} else {
				o += '<div style="padding: 0.5em"></div>'
			}
		}
	} else {
		o = ""
	}

	document.getElementById("BreakdownSpot").innerHTML = o

	if (curCipher.sumArr.length > 0 && optCompactBreakdown == false) { // include plain phrase inside breakdown chart 
		var simplePhr = ""
		if (optAllowPhraseComments) {
			simplePhr = sValNoComments() // exclude text inside [...]
		} else {
			simplePhr = sVal() // display full phrase
		}
		var chartClass = 'SimpleBreakChart'
		if (curCiphercp.length > chLimit) chartClass = 'SimpleBreakChartLong'
		o = '<tr><td colspan=' + tdCount + '>'
		o += '<div class="'+chartClass+'"><span class="breakPhraseChart">' + simplePhr + ' = '
		o += curCipher.wheelCipher ? getSumStr(curCipher.sv) :
			curCipher.sumArr.reduce(getSum) // add all values in array
		o += ' </span><span class="breakPhraseChartCiphName" style="'+curCiphCol+'">(' + curCipher.cipherName + gemCalcModeLabel(curCipher) + ')</span></div></td></tr>'
		$('#BreakTableContainer').prepend(o) // insert in the beginning of the table
	}

	oo = 'background: var(--table-row-odd);'
	if (optGradientCharts) {
		oo = 'background: '+bgCol+' -webkit-linear-gradient(0deg,'+curGradCol+', rgba(0,0,0,0.0));'
		oo += 'background: '+bgCol+' -o-linear-gradient(0deg,'+curGradCol+', rgba(0,0,0,0.0));'
		oo += 'background: '+bgCol+' -moz-linear-gradient(0deg,'+curGradCol+', rgba(0,0,0,0.0));'
		oo += 'background: '+bgCol+' linear-gradient(0deg,'+curGradCol+', rgba(0,0,0,0.0));'
	}
	$("#BreakTableContainer").attr("style", oo);
}

function calcLongBreakdownWidth(curCipher) { // boolean, determine if phrase is long enough for line breaks
	var i;
	var newLine = true; words = 0; n = "";
	var breakArr = []; var widthCount = 0;

	if (!curCipher.multiCharacter) {
		for (i = 0; i < curCipher.cv.length; i++) {
			if (curCipher.cv[i] !== " ") {
				if (n == "") {n = i}
				if (curCipher.cv[i] > 99) {
					widthCount += 2
				} else {
					widthCount += 1.25
				}
				if (widthCount > maxRowWidth && newLine == false) {
					breakArr.push(words - 1)
					widthCount = 0
					i = n - 1
					return true
				}
			} else {
				widthCount += 2
				words++
				n = ""
				newLine = false
			}
		}
	} else { // syllable mode
		var sLen = curCipher.cArr[0]
		for (i = 0; i < curCipher.sv.length; i++) {
			if (curCipher.sv[i] !== " ") {
				if (n == "") {n = i}
				widthCount += sLen
				if (widthCount > maxRowWidth && newLine == false) {
					breakArr.push(words - 1)
					widthCount = 0
					i = n - 1
					return true
				}
			} else {
				widthCount += sLen
				words++
				n = ""
				newLine = false
			}
		}
	}
	return false
}

function buildLongBreakdown(curCipher) {
	var i;
	var newLine = true; words = 0; n = "";
	var breakArr = []; var widthCount = 0;

	if (!curCipher.multiCharacter) {
		for (i = 0; i < curCipher.cv.length; i++) {
			if (curCipher.cv[i] !== " ") {
				if (n == "") {n = i}
				if (curCipher.cv[i] > 99) {
					widthCount += 2
				} else {
					widthCount += 1.25
				}
				if (widthCount > maxRowWidth && newLine == false) {
					breakArr.push(words - 1)
					widthCount = 0
					i = n - 1
					newLine = true
				}
			} else {
				widthCount += 2
				words++
				n = ""
				newLine = false
			}
		}
	} else { // syllable mode
		var sLen = curCipher.cArr[0]
		for (i = 0; i < curCipher.sv.length; i++) {
			if (curCipher.sv[i] !== " ") {
				if (n == "") {n = i}
				widthCount += sLen
				if (widthCount > maxRowWidth && newLine == false) {
					breakArr.push(words - 1)
					widthCount = 0
					i = n - 1
					newLine = true
				}
			} else {
				widthCount += sLen
				words++
				n = ""
				newLine = false
			}
		}
	}
	return breakArr
}

function updateCipherChart(curCipher) {

	if (optShowCipherChart == false) {
		document.getElementById("ChartSpot").innerHTML = ""
		return
	}

	var curCiphercArr = curCipher.multiCharacter ? curCipher.sArr : curCipher.cArr // syllables or characters

	curCiphCol = (optColoredCiphers) ? 'color: hsl('+curCipher.H+' '+curCipher.S+'% '+curCipher.L+'% / 1)' : ''
	curCiphFaintCol = (optColoredCiphers) ? 'color: hsl('+curCipher.H+' '+curCipher.S+'% '+curCipher.L+'% / 0.25)' : ''
	curGradCol = (optColoredCiphers) ? 'hsl('+curCipher.H+' '+curCipher.S+'% '+curCipher.L+'% / 0.2)' : 'hsl(0 0% 0% / 0.1)'

	var o = 'background: var(--table-row-odd);'
	if (optGradientCharts) {
		o = 'background: '+bgCol+' -webkit-linear-gradient(0deg,'+curGradCol+', rgba(0,0,0,0.0));'
		o += 'background: '+bgCol+' -o-linear-gradient(0deg,'+curGradCol+', rgba(0,0,0,0.0));'
		o += 'background: '+bgCol+' -moz-linear-gradient(0deg,'+curGradCol+', rgba(0,0,0,0.0));'
		o += 'background: '+bgCol+' linear-gradient(0deg,'+curGradCol+', rgba(0,0,0,0.0));'
	}
	o += 'min-height: 166px;' // avoid layout shift when Agrippa ciphers are active
	o += 'margin-top: 1em;'
	o += 'margin-bottom: 0.5em;'
	o += 'padding: 0.8em;'
	$("#ChartSpot").attr("style", o);

	o = '<table id="ChartTable">'
	o += '<tbody><tr>'

	o += '<tr>'
	o += '<td id="spaceChartBtn" style="font-size: 150%; font-weight: 500; '+curCiphFaintCol+'">-</td>' // Space
	o += '<td id="capsNameChartBtn" colspan="' + (Math.ceil(curCiphercArr.length / 2) - 2) + '">'
	o += '<font style="font-size: 150%; font-weight: 500; '+curCiphCol+'">' + curCipher.cipherName + '</font>'
	o += '</td>'
	o += '<td id="backspaceChartBtn" style="font-size: 150%; font-weight: 500; '+curCiphFaintCol+'">&#8592;</td>' // Backspace
	o += '</tr><tr>'

	var halfL = curCiphercArr.length / 2
	for (var x = 0; x < curCiphercArr.length; x++) {
		if (x - halfL == 0 || x - halfL == 0.5) {
			o += '</tr><tr>'
			for (var y = 0; y < x; y++) { // 2nd row (values)
				o += '<td class="ChartVal">' + curCipher.vArr[y] + '</td>'
			}
			o += '</tr><tr>'
		}
		if (!curCipher.multiCharacter) { o += (showCapsCipherChart && !curCipher.caseSensitive) ? '<td class="ChartChar" font style="'+curCiphCol+'">' + String.fromCodePoint(curCiphercArr[x]).toUpperCase() + '</td>' : '<td class="ChartChar" font style="'+curCiphCol+'">' + String.fromCodePoint(curCiphercArr[x]) + '</td>' }
		else { o += (showCapsCipherChart && !curCipher.caseSensitive) ? '<td class="ChartChar" font style="'+curCiphCol+'">' + curCiphercArr[x].toUpperCase() + '</td>' : '<td class="ChartChar" font style="'+curCiphCol+'">' + curCiphercArr[x] + '</td>' }
	}
	if (curCiphercArr.length % 2 == 1) { o += '<td class="ChartChar" font style="'+curCiphCol+'"></td>' } // empty character cell to make even rows
	o += '</tr><tr>'
	for (y; y < x; y++) {
		o += '<td class="ChartVal">' + curCipher.vArr[y] + '</td>' // 4th row (values)
	}
	if (curCiphercArr.length % 2 == 1) { o += '<td class="ChartVal"></td>' } // empty value cell to make even rows
	o += '</tr></tbody></table>'

	document.getElementById("ChartSpot").innerHTML = o
}