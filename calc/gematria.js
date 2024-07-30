// ========================== Cipher Class ==========================

function stringToArrCodePoint(s) { // 'abc' -> ['a','b','c'], support for surrogate pairs, full Unicode range
	var a = new Array() // emoji with modifiers and composite emoji with Zero Width Joiner are not supported
	for (let i = 0; i < s.length;) {
		let c = s.codePointAt(i) // current codePoint
		a.push(String.fromCodePoint(c)); i += (c <= 65535) ? 1 : 2 // advance by 2 characters for a surrogate pair
	}
	return a
}

function calcCipherSyllables(cArr) { // convert list of codePoints to syllables
	var sLen = cArr[0]; var tSyl = ''; var sArr = []
	for (let i = 0; i < (cArr.length-1)/sLen; i++) {
		tSyl = '' // temp syllable
		for (let n = 0; n < sLen; n++) { // syllable length
			let cP = cArr[1 + sLen*i + n] // get codePoint
			if (cP > 0) tSyl += String.fromCodePoint(cP) // exclude 0
		}
		sArr.push(tSyl) // add constructed syllable
	}
	return sArr
}

class cipher { // cipher constructor class
	constructor(cipherName, cipherCategory, col_H, col_S, col_L, ciphCharacterSet, ciphValues,
		diacriticsAsRegular = true, ciphEnabled = false, caseSensitive = false, multiCharacter = false, wheelCipher = false, cipherDescription = '') {
		this.cipherName = cipherName // cipher name
		this.cipherCategory = cipherCategory // cipher category
		this.H = col_H // hue
		this.S = col_S // saturation
		this.L = col_L // lightness
		this.cArr = ciphCharacterSet // character array
		this.sArr = multiCharacter ? calcCipherSyllables(this.cArr) : [] //  syllable array, multiCharacter
		this.vArr = ciphValues // value array
		this.diacriticsAsRegular = diacriticsAsRegular // if true, characters with diactritic marks have the same value as regular ones
		this.enabled = ciphEnabled // cipher state on/off
		this.caseSensitive = caseSensitive // capital letters have different values
		this.multiCharacter = multiCharacter // assign value to a syllable or word
		this.wheelCipher = wheelCipher // uses letters instead of values
		this.cipherDescription = cipherDescription // brief cipherkey description
		this.cp = []; this.cv = [] // cp - breakdown character, cv - character value
		this.sp = []; this.sv = [] // sp - breakdown syllable, sv - syllable value
		this.sumArr = [] // phrase gematria value
	}

	calcGematria(gemPhrase) { // calculate gematria of a phrase
		var i, ch_pos, cur_char
		var gemValue = 0 // returns final value for numerical ciphers
		var letValue = '' // returns letter output for wheel ciphers
		var n = 0
		
		if (optAllowPhraseComments == true) { gemPhrase = gemPhrase.replace(/\[.+\]/g, '').trim() } // remove [...], leading/trailing spaces
		if (this.diacriticsAsRegular) gemPhrase = gemPhrase.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
		if (this.caseSensitive == false) gemPhrase = gemPhrase.toLowerCase()
		if (optDotlessLatinI == true) gemPhrase = gemPhrase.replace(/ı/g, 'i')

		var gemPhraseArr = stringToArrCodePoint(gemPhrase) // codePoint array

		if (this.multiCharacter == true) { // syllable mode, only standard calculation, no numbers counted
			var sLen = this.cArr[0] // max syllable length
			var n = 0 // current syllable length modifier
			for (let i = 0; i < gemPhraseArr.length;) {
				cur_char = '' // current syllable, reset
				for (let p = i; p < i+sLen-n && p < gemPhraseArr.length; p++) { // in bounds, s - syllable length, p - position
					cur_char += gemPhraseArr[p] // build current syllable from phrase
				}
				ch_pos = this.caseSensitive ? this.sArr.indexOf(cur_char) :
					this.sArr.indexOf(cur_char.toLowerCase()) // syllable position in assigned syllable array
				if (ch_pos > -1) { // full syllable found
					if (this.wheelCipher == false) { gemValue += this.vArr[ch_pos] } else { letValue += String(this.vArr[ch_pos]) } // add value/letter
					i += sLen-n // advance position by syllable length, codePoint aware
					n = 0 // reset syllable length modifier
				} else { // full syllable not found, shorten current syllable
					if (n < sLen) { // as short as a single character BUG HERE, IF sLen INFINITE LOOP, IF sLen-1 last letter excluded
						n += 1 // continue building a shorter syllable from same position
					} else { // even a single character is not found
						n = 0 // reset syllable length modifier
						i++ // advance position, try next full syllable
					}
				}
			}
			if (this.wheelCipher == false) { return gemValue } else { return letValue } // no number calculation
		}

		if (optGemSubstitutionMode || this.wheelCipher) { // each character is substituted with a corresponding value
			for (i = 0; i < gemPhraseArr.length; i++) {
				cur_char = gemPhraseArr[i].codePointAt(0)
				ch_pos = this.cArr.indexOf(cur_char)
				if (ch_pos > -1) { // append value for each found character
					if (this.wheelCipher == false) { gemValue += this.vArr[ch_pos] } else { letValue += String(this.vArr[ch_pos]) } // add value/letter
				}
			}
			if (this.wheelCipher) { return letValue } // return letters for wheel cipher, no number calculation
		} else if (optGemMultCharPos) { // multiply each charater value based on character index
			for (i = 0; i < gemPhraseArr.length; i++) {
				cur_char = gemPhraseArr[i].codePointAt(0)
				ch_pos = this.cArr.indexOf(cur_char)
				if (ch_pos > -1) { // append value for each found character
					n++
					gemValue += this.vArr[ch_pos] * n
				}
			}
			return gemValue // no number calculation
		} else if (optGemMultCharPosReverse) { // multiply each charater value (reverse index)
			for (i = gemPhraseArr.length; i > 0; i--) {
				cur_char = gemPhraseArr[i-1].codePointAt(0)
				ch_pos = this.cArr.indexOf(cur_char)
				if (ch_pos > -1) { // append value for each found character
					n++
					gemValue += this.vArr[ch_pos] * n
				}
			}
			return gemValue // no number calculation
		}

		if (this.cArr.indexOf(49) == -1) { // if cipher doesn't contain "1"
			if (optNumCalcMethod == 1) { // Full, treat consecutive digits as one number
				var cur_num = ""
				var digitArr = [48,49,50,51,52,53,54,55,56,57] // 0-9
				var nArr = [0,1,2,3,4,5,6,7,8,9]
				for (i = 0; i < gemPhraseArr.length; i++) {
					cur_char = gemPhraseArr[i].codePointAt(0)
					if (digitArr.indexOf(cur_char) > -1) {
						cur_num += String(nArr[digitArr.indexOf(cur_char)]) // append consecutive digits
					} else if (cur_num.length > 0 && cur_char !== 44) { // exclude comma as number separator
						gemValue += Number(cur_num) // add value of the number
						cur_num = "" // reset
					}
				}
				if (cur_num.length > 0) {
					gemValue += Number(cur_num) // add last number if present
				}
			} else if (optNumCalcMethod == 2) { // Reduced, add each digit separately
				for (i = 0; i < gemPhraseArr.length; i++) {
					cur_char = gemPhraseArr[i].codePointAt(0)
					if (cur_char > 47 && cur_char < 58) { // 48 to 57, 0-9
						gemValue += cur_char - 48
					}
				}
			}
		}

		return gemValue
	}

	calcBreakdown(gemPhrase) { // character breakdown table
		var i, cIndex, wordSum //
		var lastSpace = true
		var nd, nv // n - character for display, nv - codePoint for calculation

		 // remove [...], separate brackets, leading/trailing spaces
		if (optAllowPhraseComments == true) { gemPhrase = gemPhrase.replace(/\[.+\]/g, '').replace(/\[/g, '').replace(/\]/g, '').trim() }

		var gemPhraseArr = stringToArrCodePoint(gemPhrase) // codePoint array

		// breakdown characters, character values, breakdown syllables, syllable values, current number (if char is a digit)
		this.cp = []; this.cv = []; this.sp = []; this.sv = []; this.curNum = ""; this.LetterCount = 0
		this.sumArr = []; wordSum = 0
		
		if (this.multiCharacter == true && gemPhraseArr.length > 0) { // syllable mode, only standard calculation, no numbers counted
			var sLen = this.cArr[0] // max syllable length
			var n = 0 // current syllable length modifier
			for (let i = 0; i < gemPhraseArr.length;) {
				var cur_char = '' // current syllable, reset
				for (let p = i; p < i+sLen-n && p < gemPhraseArr.length; p++) { // in bounds, s - syllable length, p - position
					cur_char += gemPhraseArr[p] // build current syllable from phrase
				}
				var ch_pos = this.caseSensitive ? this.sArr.indexOf(cur_char) :
					this.sArr.indexOf(cur_char.toLowerCase()) // syllable position in assigned syllable array
				if (ch_pos > -1) { // full syllable found
					this.sp.push(cur_char) // save current syllable
					this.sv.push(this.vArr[ch_pos]) // save current syllable value
					this.LetterCount++ // increase letter/token count
					if (!this.wheelCipher) wordSum += this.vArr[ch_pos] // build word sum
					i += sLen-n// advance position by syllable length, codePoint aware
					n = 0 // reset syllable length modifier
				} else { // full syllable not found, shorten current syllable
					if (n < sLen) { // as short as a single character BUG HERE sLen-1 NO LAST LETTER OTHERWISE INF LOOP
						n += 1 // continue building a shorter syllable from same position
					} else { // even a single character is not found
						if (this.sv.length !== 0 && this.sv[this.sv.length-1] !== " ") { // never add first space
							this.sp.push(" "); this.sv.push(" ") // add break
							this.sumArr.push(wordSum) // save word value
						}
						wordSum = 0 // reset word value counter
						n = 0 // reset syllable length modifier
						i++ // advance position, try next full syllable
					}
				}
			}
			if (this.sv.length !== 0 && this.sv[this.sv.length-1] !== " ") { // add last space if non empty
				this.sumArr.push(wordSum) // last word value
				if (this.sumArr.length > 1) { this.sp.push(" "); this.sv.push(" ") } // no space in the end for a single word
			}
			this.WordCount = this.sumArr.length // word count
			return
		}

		for (i = 0; i < gemPhraseArr.length; i++) {

			nd = gemPhraseArr[i].codePointAt(0); // get codePoint for each character in phrase

			if (this.diacriticsAsRegular) { // if characters with diacritic marks are treated as regular characters
				nv = gemPhraseArr[i].normalize('NFD').replace(/[\u0300-\u036f]/g, "")
			} else {
				nv = gemPhraseArr[i] // formatted codePoint (lowercase) - for calculation
			}
			if (this.caseSensitive == false) nv = nv.toLowerCase()
			if (optDotlessLatinI == true) nv = nv.replace(/ı/g, 'i')
			nv = nv.codePointAt(0)

			var boolCalcCheck = ( !optGemMultCharPos && !optGemMultCharPosReverse &&
				!this.multiCharacter && !this.wheelCipher ) // no Mult/Rev mode, not a syllable/wheel cipher
			// 0-9 digits, cipher doesn't contain "1"
			if (nd > 47 && nd < 58 && this.cArr.indexOf(49) == -1 && boolCalcCheck) {
				if (optNumCalcMethod == 1) { // Full
					this.curNum = String(this.curNum) + String(nd - 48) // append digits
					if (lastSpace == false) {
						this.cp.push(" ")
						this.cv.push(" ")
						this.sumArr.push(wordSum)
						wordSum = 0
						lastSpace = true
					}
				} else if (optNumCalcMethod == 2) { // Reduced
					this.cp.push("num" + String(nd - 48))
					this.cv.push(nd - 48)
					this.curNum = String(nd - 48)
					wordSum += nd - 48
					lastSpace = false
				}
				
			} else {
				if (optNumCalcMethod == 1 && boolCalcCheck) { // Full
					if (this.curNum.length > 0 & nd !== 44) { // character is not "44" comma (digit separator)
						this.cp.push("num" + String(this.curNum), " ")
						this.cv.push(Number(this.curNum), " ")
						this.sumArr.push(Number(this.curNum))
						this.curNum = ""
					}
				}
				
				cIndex = this.cArr.indexOf(nv) // index of current character in phrase inside all character arrays available for current cipher
				if (cIndex > -1) {
					lastSpace = false
					if (!this.wheelCipher) wordSum += this.vArr[cIndex]
					this.cp.push(nd)
					this.LetterCount++
					this.cv.push(this.vArr[cIndex])
				} else if (nd !== 39 && lastSpace == false) {
					this.sumArr.push(wordSum)
					wordSum = 0
					this.cp.push(" ")
					this.cv.push(" ")
					lastSpace = true
				}
			}
		}
		if (lastSpace == false) {this.sumArr.push(wordSum)} // add number value to phrase gematria
		if (this.curNum !== "") {
			if (optNumCalcMethod == 1 && boolCalcCheck) { // Full
				this.cp.push("num" + String(this.curNum))
				this.cv.push(Number(this.curNum))
				this.sumArr.push(Number(this.curNum)) // value of full number
				if (this.sumArr.length > 1) {
					this.cp.push(" ")
					this.cv.push(" ")
				}
			}
		}
		if (this.sumArr.length > 1 && lastSpace == false) {
			this.cp.push(" ")
			this.cv.push(" ")
		}

		this.WordCount = this.sumArr.length // word count

		if (optGemMultCharPos && !this.wheelCipher) { // multiply each charater value based on character index
			this.sumArr = [] // clear word sums
			wordSum = 0
			var cx = 0 // vaild character index
			for (i = 0; i < this.cp.length; i++) {
				if (typeof(this.cp[i]) == "number") { // character value, not "numXX"
					cx++
					this.cv[i] *= cx // multiply character value by position
					wordSum += this.cv[i]
				} else if (this.cp[i] == " ") { // space
					this.sumArr.push(wordSum)
					wordSum = 0 // reset
				} else if (typeof(this.cp[i]) == "string") { // numerical value "numXX"
					this.sumArr.push(this.cv[i]) // push number itself
					wordSum = 0 // reset
				}
			}
			if (wordSum !== 0) this.sumArr.push(wordSum) // last word value
		} else if (optGemMultCharPosReverse && !this.wheelCipher) { // multiply each charater value (reverse index)
			this.sumArr = [] // clear word sums
			wordSum = 0
			var cx = 0 // vaild character index
			var count = this.cp.length-1 // array index is one less
			if (this.cp[this.cp.length - 1] == " ") count = this.cp.length-2 // exclude last character if a space

			for (i = count; i >= 0; i--) {
				if (typeof(this.cp[i]) == "number") { // character value, not "numXX"
					cx++
					this.cv[i] *= cx // multiply character value by position
					wordSum += this.cv[i]
				} else if (this.cp[i] == " ") { // space
					this.sumArr.unshift(wordSum) // insert in the beginning of array
					wordSum = 0 // reset
				} else if (typeof(this.cp[i]) == "string") { // numerical value "numXX"
					this.sumArr.unshift(this.cv[i]) // number itself
					wordSum = 0 // reset
				}
			}
			if (wordSum !== 0) this.sumArr.unshift(wordSum) // last word value
		}
	}

}