// ======================== Encoding Ciphers ========================
/*
Types of ciphers:

- Ordinal +N offset, e.g. 36,37,38... (+35)
- +N offset +M increment, e.g. 10,12,14... (+9 +2)
- Kaye rotation, all +N offset, starts at different letter, increments may vary

(look weird)
- 1st part of alphabet flipped
- 2nd part of alphabet flipped
- Both parts of alphabet flipped

(lots of matches)
- Septenary 7-1-7 7-1-7 (not implemented)
- Inverse Septenary 1-7-1 1-7-1 (not implemented)
- "Sumerian" ciphers, e.g. Ordinal x6
  (included in +M-1 offset / +M increment, e.g. 6[1+5], 12, ...)

Reverse, "Sumerian" (R), Reduction (R) and Extended (R) can be derived for most ciphers
*/

var enccDefAlph = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
var enccFlipAlphArr = [] // store flipped versions of alphabet
var enccAllCiph = [] // list of all combinations of ciphers
var enccAllCiphGem = [] // gematria for current phrase in all ciphers
var enccMCiphArr = [] // array of matching ciphers (phrase equal to a specific value)
var enccAllowAlphRotation = false // allow alphabet rotation

function enc_SwitchAlphabet() {
	if (enccDefAlph.length == 26) {
		enccDefAlph = ['a','b','c','d','e','f','g','h','i','k','l','m','n','o','p','q','r','s','t','u','w','x','y','z']
	} else {
		enccDefAlph = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
	}
	enc_BuildAllCiphers()
}

function enc_ToggleAlphRotation() {
	enccAllowAlphRotation = !enccAllowAlphRotation
	enc_BuildAllCiphers()
}

// flipped alphabet, offset (all +N), increment (next is previous +N), rotation (starting letter), reverse
function enc_BuildCipher(alpH = 0, ofF = 0, inC = 1, roT = 0, reV = 0) {
	var chArray = []; var chValues = [];
	var curAlph = enccFlipAlphArr[alpH] // choose flipped alphabet variation
	for (var i = 0; i < curAlph.length; i++) {
		chArray.push(curAlph[roT]); roT = (roT + 1) % curAlph.length; // rotate alphabet
		chValues.push( 1+i+ofF + (i*(inC-1)) ) // calculate current char value
	}
	if (reV == 1) chValues.reverse() // reverse values
	return [chArray, chValues] // return alphabet and values
}

function enc_BuildAllCiphers(firstRun = false) {
	enc_BuildFlippedAlphabets()
	var alpH, ofF, inC, roT, reV; var roTstate = ''
	// 4 x 100 x 25 x 26 x 1 = 260,000 (English 26, rotations, mirrored and swapped alphabet rows - 4 variations, no need to reverse, don't swap rows if rotation)
	if (enccAllowAlphRotation) { alpH = 3; ofF = 99; inC = 25; roT = enccDefAlph.length-1; reV = 0; roTstate = 'rotation'}
	// 8 x 100 x 25 x 1 x 1 = 20,000 (no rotations, mirrored and swapped alphabet rows - 8 variations, no need to reverse)
	else { alpH = 7; ofF = 99; inC = 25; roT = 0; reV = 0; roTstate = 'no rotation'}
	var a,o,i,r,R; enccAllCiph = [];
	if (!firstRun) console.log('Building ciphers for encoder, please wait...')
	for (a = 0; a <= alpH; a++) { // flipped alphabet variations (8 total)
		for (o = 0; o <= ofF; o++) { // all character value offset
			for (i = 1; i <= inC; i++) { // next character value increment
				for (r = 0; r <= roT; r++) { // alphabet rotation
					for (R = 0; R <= reV; R++) { // reversed values
						enccAllCiph.push(enc_BuildCipher(a,o,i,r,R))
					}
				}
			}
		}
	}
	if (!firstRun) console.log('Done! ('+enccAllCiph.length+' ciphers, '+enccDefAlph.length+' letter alphabet, '+roTstate+')')
}

function enc_BuildFlippedAlphabets() { // flip rows in alphabet - 4 variations, swap rows - 4 variations, 8 total
	enccFlipAlphArr = []; var tmpAlph = []; var n, p;
	var hInd = Math.floor(enccDefAlph.length / 2) - 1 // index of the last char in the first half of alphabet
	var aLen = enccDefAlph.length // alphabet length
	// 0 = normal - normal
	enccFlipAlphArr.push(enccDefAlph); tmpAlph = [];
	// 1 = flipped - normal
	for (n = 0; n < enccDefAlph.length; n++) {
		if (n <= hInd) { tmpAlph.push(enccDefAlph[hInd-n]) }
		else { tmpAlph.push(enccDefAlph[n]) }
	}
	enccFlipAlphArr.push(tmpAlph); tmpAlph = [];
	// 2 = normal - flipped
	for (n = 0; n < enccDefAlph.length; n++) {
		if (n <= hInd) { tmpAlph.push(enccDefAlph[n]) }
		else { tmpAlph.push(enccDefAlph[ aLen-1 - (n%(hInd+1)) ]) } // hInd+1 because index is -1
	}
	enccFlipAlphArr.push(tmpAlph); tmpAlph = [];
	// 3 = flipped - flipped
	for (n = 0; n < enccDefAlph.length; n++) {
		if (n <= hInd) { tmpAlph.push(enccDefAlph[hInd-n]) }
		else { tmpAlph.push(enccDefAlph[ aLen-1 - (n%(hInd+1)) ]) }
	}
	enccFlipAlphArr.push(tmpAlph);
	// 4,5,6,7 = swap 1st and 2nd rows
	var fLen = enccFlipAlphArr.length
	for (n = 0; n < fLen; n++) {
		tmpAlph = [];
		for (p = 0; p < enccFlipAlphArr[0].length; p++) {
			if (p <= hInd) { tmpAlph.push(enccFlipAlphArr[n][p+hInd+1]) } // hInd+1 because index is -1
			else { tmpAlph.push(enccFlipAlphArr[n][p-hInd-1]) }
		}
		enccFlipAlphArr.push(tmpAlph);
	}
}

function enc_CalcGemValue(wd, cIndex = 0) { // word, cipher index
	var i; var ans = 0; var ind = 0; // initialize variables
	for (i = 0; i < wd.length; i++) { // for each character in word
		ind = enccAllCiph[cIndex][0].indexOf(wd.substring(i,i+1))
		if (ind > -1) { // if current character (of word) is present in cipher array
			ans += enccAllCiph[cIndex][1][ind] // add corrensponding value to total
		}
	}
	return ans // returns value
}

function enc_CalcAllGemValues(wd) {
	var i; enccAllCiphGem = [];
	for (i = 0; i < enccAllCiph.length; i++) enccAllCiphGem.push(enc_CalcGemValue(wd,i))
}

function enc_CalcAllGemValuesArray(wdArr) {
	var i, n; var tArr = []; enccAllCiphGem = [];
	for (i = 0; i < enccAllCiph.length; i++) {
		for (n = 0; n < wdArr.length; n++) {
			tArr.push(enc_CalcGemValue(wdArr[n],i))
		}
		enccAllCiphGem.push(tArr); tArr = []
	}
}

function enc_FindGemValue(num) {
	var i; enccMCiphArr = [];
	for (i = 0; i < enccAllCiphGem.length; i++) {
		if (enccAllCiphGem[i] == num) enccMCiphArr.push([i,enccAllCiph[i]])
	}
}

function enc_FindMatchingCiphers(wd, num) {
	var i;
	var wdCalc = wd.toLowerCase().replace(/ /g, '') // convert word to lowercase, remove spaces
	enc_CalcAllGemValues(wdCalc)
	enc_FindGemValue(num)
	console.log('"'+wd+'" = '+num+' in '+enccMCiphArr.length+' ciphers (English '+enccDefAlph.length+'):') // insert J, V values for English 24 ciphers
	if (enccDefAlph.length == 24 && enccMCiphArr.length > 0 && enccMCiphArr[0][1][0].indexOf('j') == -1) enc_InsertJVto24Cipher()
	for (i = 0; i < enccMCiphArr.length; i++) {
		console.log(
			enccMCiphArr[i][0] + '\n' + // cipher index
			JSON.stringify(enccMCiphArr[i][1][0]).slice(1,-1).replace(/[,"\\]/g, '') + '\n' + // characters
			JSON.stringify(enccMCiphArr[i][1][1]).slice(1,-1).replace(/["\\]/g, '') +// values
			'\n')
	}
}

function enc_FindCommonCiphers(wdArr, num = 0) { // wdArr - array of words, num - value for matching (optional)
	var i, n; var mVal = num; var mValArr = []; var mValUniqArr = []; enccMCiphArr = [];
	for (i = 0; i < wdArr.length; i++) { wdArr[i] = wdArr[i].toLowerCase().replace(/ /g, '') } // convert word to lowercase, remove spaces
	enc_CalcAllGemValuesArray(wdArr)
	commonCipherLoop:
	for (i = 0; i < enccAllCiphGem.length; i++) {
		if (num == 0) { mVal = enccAllCiphGem[i][0] } // find any equal numbers if zero
		for (n = 0; n < enccAllCiphGem[i].length; n++) {
			if (mVal !== enccAllCiphGem[i][n]) { continue commonCipherLoop }
		}
		enccMCiphArr.push([i,enccAllCiph[i]])
		mValArr.push(mVal) // store matching values separately (for export to work correctly)
		if (mValUniqArr.indexOf(mVal) == -1) { mValUniqArr.push(mVal) }
	}
	var wd = JSON.stringify(wdArr).slice(1,-1).replace(/"/g,'').replace(/,/g, ', ')
	console.log('"'+wd+'" have the same value in '+enccMCiphArr.length+' ciphers (English '+enccDefAlph.length+'):') // insert J, V values for English 24 ciphers
	if (enccDefAlph.length == 24 && enccMCiphArr.length > 0 && enccMCiphArr[0][1][0].indexOf('j') == -1) enc_InsertJVto24Cipher()
	for (i = 0; i < enccMCiphArr.length; i++) {
		console.log(
			'' + wd + ' = ' + mValArr[i] + '\n' + // matching value
			enccMCiphArr[i][0] + '\n' + // cipher index
			JSON.stringify(enccMCiphArr[i][1][0]).slice(1,-1).replace(/[,"\\]/g, '') + '\n' + // characters
			JSON.stringify(enccMCiphArr[i][1][1]).slice(1,-1).replace(/["\\]/g, '') +// values
			'\n')
	}
	if (mValUniqArr.length > 0 && num == 0 ) { // list all available values (unique)
		mValUniqArr.sort(function(a, b) { // sort ascending order
				return a - b; //  b - a, for descending sort
		});
		console.log(JSON.stringify(mValUniqArr).slice(1,-1).replace(/,/g, ', '))
	}
}

function enc_InsertJVto24Cipher() {
	var i, ind;
	for (i = 0; i < enccMCiphArr.length; i++) {
		ind = enccMCiphArr[i][1][0].indexOf('i')
		enccMCiphArr[i][1][0].splice(ind+1, 0, 'j')
		enccMCiphArr[i][1][1].splice(ind+1, 0, enccMCiphArr[i][1][1][ind])
		ind = enccMCiphArr[i][1][0].indexOf('u')
		enccMCiphArr[i][1][0].splice(ind+1, 0, 'v')
		enccMCiphArr[i][1][1].splice(ind+1, 0, enccMCiphArr[i][1][1][ind])
	}
}

// ==================================================================

function enc_GetRedExtFromCipher(arr) {
	var outR = ''; var outE = ''; var i, rNum; var n = 1;
	for (i = 0; i < arr.length; i++) {
		if (i % 9 == 0 && i !== 0) n *= 10 // extended, x10 on each new loop
		rNum = arr[i]%9 // reduced number
		if (rNum == 0) rNum = 9
		outR += rNum + ','; outE += rNum*n + ',' // build string
	}
	console.log(outR.slice(0,-1)+'\n'+outE.slice(0,-1))
}

function enc_ExportFoundCiphers() {
	var out =
		'// ciphers.js\n'+
		'\n'+
		'/*\n'+
		'new cipher(\n'+
			'\t"English Ordinal", // cipher name\n'+
			'\t"English", // category\n'+
			'\t120, 57, 36, // hue, saturation, lightness\n'+
			'\t[97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122], // lowercase characters\n'+
			'\t[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26], // values\n'+
			'\ttrue, // characters with diacritic marks have the same value as regular ones, default is "true"\n'+
			'\ttrue // enabled state, default is "false"\n'+
			'\tfalse // case sensitive cipher, default is "false"\n'+
		')\n'+
		'*/\n\n'

	out += "cipherList = [\n"
	for (i = 0; i < enccMCiphArr.length; i++) {
		
		var cArr_ = []
		var vArr_ = []
		
		// Read list of characters
		for (m = 0; m < enccMCiphArr[i][1][0].length; m++) {
			// cArr_.push(String.fromCharCode(cipherList[i].cArr[m])) // character
			cArr_.push(enccMCiphArr[i][1][0][m].charCodeAt(0)) // charcode
			vArr_.push(enccMCiphArr[i][1][1][m]) // value
		}
		
		out +=
			'\tnew cipher(\n'+
			'\t\t"'+enccMCiphArr[i][0]+'",\n'+
			'\t\t"Encoding",\n'+
			'\t\t'+rndInt(0, 360)+', '+rndInt(0, 68)+', '+rndInt(53, 67)+',\n'+
			'\t\t'+JSON.stringify(cArr_)+',\n'+
			'\t\t'+JSON.stringify(vArr_)+',\n'+
			'\t\ttrue,\n'+
			'\t\ttrue,\n'+
			'\t\tfalse\n'+
			'\t),\n'
	}
	out = out.substring(0, out.length-2) + '\n]' // remove last comma and new line, close array
	// console.log(out)

	out = 'data:text/js;charset=utf-8,'+encodeURIComponent(out) // format as text file
	// ciphers_2021-03-26_10-23-52.js
	download("ciphers_"+getTimestamp()+".js", out); // download file
}

// ==================================================================

function enc_Help() {
	console.log(
		'----------------------------------------------------------------------------------------------------\n'+
		'enc_FindMatchingCiphers(\'phrase\', 222) - find ciphers for any phrase to match a specific value\n'+
		'enc_FindCommonCiphers(["word","phrase","text"], 222) - find common ciphers for multiple phrases to match a specific value (value is optional)\n'+
		'enc_SwitchAlphabet() - switch between 24/26 letter English ciphers\n'+
		'enc_ToggleAlphRotation() - allow alphabet rotation in ciphers\n'+
		'enc_ExportFoundCiphers() - export matching ciphers (JS format, can be loaded into Gematro)\n'+
		'enc_GetRedExtFromCipher([1,2,3]) - print Reduced and Extended variants of given cipher in console\n'+
		'enc_Help() - get a list of available commands with description\n'+
		'----------------------------------------------------------------------------------------------------')
}

enc_BuildAllCiphers(true) // first run, no logs