// ========================== Cipher Class ==========================

class cipher { // cipher constructor class
	constructor(ciphName, ciphCategory, col_H, col_S, col_L, ciphCharacterSet, ciphValues, diacriticsAsRegular = true, ciphEnabled = false, caseSensitive = false) {
		this.cipherName = ciphName // cipher name
		this.cipherCategory = ciphCategory // cipher category
		this.H = col_H // hue
		this.S = col_S // saturation
		this.L = col_L // lightness
		this.cArr = ciphCharacterSet // character array
		this.vArr = ciphValues // value array
		this.diacriticsAsRegular = diacriticsAsRegular // if true, characters with diactritic marks have the same value as regular ones
		this.caseSensitive = caseSensitive // capital letters have different values
		this.enabled = ciphEnabled // cipher state on/off
		this.cp = []; this.cv = []; this.sumArr = [] // cp - character position, cv - character value, sumArr - phrase gematria value
	}

	calcGematria(gemPhrase) { // calculate gematria of a phrase
		var i, ch_pos, cur_char
		var gemValue = 0
		var n = 0
		
		if (optAllowPhraseComments == true) { gemPhrase = gemPhrase.replace(/\[.+\]/g, '').trim() } // remove [...], leading/trailing spaces
		if (this.diacriticsAsRegular) gemPhrase = gemPhrase.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
		if (this.caseSensitive == false) gemPhrase = gemPhrase.toLowerCase()

		if (optGemSubstitutionMode) { // each character is substituted with a correspondent value
			for (i = 0; i < gemPhrase.length; i++) {
				cur_char = gemPhrase.charCodeAt(i)
				ch_pos = this.cArr.indexOf(cur_char)
				if (ch_pos > -1) { // append value for each found character
					gemValue += this.vArr[ch_pos]
				}
			}
		} else if (optGemMultCharPos) { // multiply each charater value based on character index
			for (i = 0; i < gemPhrase.length; i++) {
				cur_char = gemPhrase.charCodeAt(i)
				ch_pos = this.cArr.indexOf(cur_char)
				if (ch_pos > -1) { // append value for each found character
					n++
					gemValue += this.vArr[ch_pos] * n
				}
			}
		} else if (optGemMultCharPosReverse) { // multiply each charater value (reverse index)
			for (i = gemPhrase.length; i >= 0; i--) {
				cur_char = gemPhrase.charCodeAt(i)
				ch_pos = this.cArr.indexOf(cur_char)
				if (ch_pos > -1) { // append value for each found character
					n++
					gemValue += this.vArr[ch_pos] * n
				}
			}
		}

		if (this.cArr.indexOf(49) == -1) { // if cipher doesn't contain "1"
			if (optNumCalcMethod == 1) { // Full, treat consecutive digits as one number
				var cur_num = ""
				var digitArr = [48,49,50,51,52,53,54,55,56,57] // 0-9
				var nArr = [0,1,2,3,4,5,6,7,8,9]
				for (i = 0; i < gemPhrase.length; i++) {
					cur_char = gemPhrase.charCodeAt(i)
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
				for (i = 0; i < gemPhrase.length; i++) {
					cur_char = gemPhrase.charCodeAt(i)
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
		var n, nv // n - character for display, nv - charcode for calculation

		 // remove [...], separate brackets, leading/trailing spaces
		if (optAllowPhraseComments == true) { gemPhrase = gemPhrase.replace(/\[.+\]/g, '').replace(/\[/g, '').replace(/\]/g, '').trim() }

		// character positions, character values, current number (if char is a digit)
		this.cp = []; this.cv = []; this.curNum = ""; this.LetterCount = 0

		this.sumArr = []; wordSum = 0
		for (i = 0; i < gemPhrase.length; i++) {

			n = gemPhrase.charCodeAt(i); // get charcode for each character in phrase

			if (this.diacriticsAsRegular) { // if characters with diacritic marks are treated as regular characters
				nv = gemPhrase.substring(i,i+1).normalize('NFD').replace(/[\u0300-\u036f]/g, "")
				// console.log(gemPhrase.substring(i,i+1)+" ("+gemPhrase.substring(i,i+1).charCodeAt(0)+
				// 	") -> "+String.fromCharCode(n).normalize('NFD').replace(/[\u0300-\u036f]/g, "")+" ("+String.fromCharCode(n).normalize('NFD').replace(/[\u0300-\u036f]/g, "").charCodeAt(0)+
				// 	") -> "+String.fromCharCode(n).normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()+" -> "+String.fromCharCode(n).normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().charCodeAt(0) )
			} else {
				nv = gemPhrase.substring(i,i+1) // formatted charcode (lowercase) - for calculation
				// console.log(gemPhrase.substring(i,i+1)+" ("+gemPhrase.substring(i,i+1).charCodeAt(0)+
				// 	") -> "+String.fromCharCode(n).toLowerCase()+" -> "+String.fromCharCode(n).toLowerCase().charCodeAt(0) )
			}
			if (this.caseSensitive == false) nv = nv.toLowerCase()
			nv = nv.charCodeAt(0)

			if (n > 47 && n < 58 && this.cArr.indexOf(49) == -1) { // 0-9 digits, cipher doesn't contain "1"
				if (optNumCalcMethod == 1) { // Full
					this.curNum = String(this.curNum) + String(n - 48) // append digits
					if (lastSpace == false) {
						this.cp.push(" ")
						this.cv.push(" ")
						this.sumArr.push(wordSum)
						wordSum = 0
						lastSpace = true
					}
				} else if (optNumCalcMethod == 2) { // Reduced
					this.cp.push("num" + String(n - 48))
					this.cv.push(n - 48)
					this.curNum = String(n - 48)
					wordSum += n - 48
					lastSpace = false
				}
				
			} else {
				if (optNumCalcMethod == 1) { // Full
					if (this.curNum.length > 0 & n !== 44) { // character is not "44" comma (digit separator)
						this.cp.push("num" + String(this.curNum), " ")
						this.cv.push(Number(this.curNum), " ")
						this.sumArr.push(Number(this.curNum))
						this.curNum = ""
					}
				}
				
				cIndex = this.cArr.indexOf(nv) // index of current character in phrase inside all character arrays available for current cipher
				if (cIndex > -1) {
					lastSpace = false
					wordSum += this.vArr[cIndex]
					this.cp.push(n)
					this.LetterCount++
					this.cv.push(this.vArr[cIndex])
				} else if (n !== 39 && lastSpace == false) {
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
			if (optNumCalcMethod == 1) { // Full
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

		if (optGemMultCharPos) { // multiply each charater value based on character index
			this.sumArr = [] // clear word sums
			wordSum = 0
			n = 0 // vaild character index (defined in cipher)
			for (i = 0; i < this.cp.length; i++) {
				if (typeof(this.cp[i]) == "number") { // character value, not "numXX"
					n++
					this.cv[i] *= n // multiply character value by position
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
		} else if (optGemMultCharPosReverse) { // multiply each charater value (reverse index)
			this.sumArr = [] // clear word sums
			wordSum = 0
			n = 0 // vaild character index (defined in cipher)
			var count = this.cp.length-1 // array index is one less
			if (this.cp[this.cp.length - 1] == " ") count = this.cp.length-2 // exclude last character if a space

			for (i = count; i >= 0; i--) {
				if (typeof(this.cp[i]) == "number") { // character value, not "numXX"
					n++
					this.cv[i] *= n // multiply character value by position
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