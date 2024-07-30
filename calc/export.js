// ============================= Export =============================

function openImageWindow(element, imgName = "", sRatio = window.devicePixelRatio, refresh = false) { // sRatio is scaling, refresh - update the image only
	var imageDataURL, wnd, scl
	if ( $(element).length ) { // if specified element exists
		// if browser zoom level is more than passed value, use current zoom level
		if (isNaN(sRatio)) { sRatio = window.devicePixelRatio }
		// if (typeof sRatio !== 'undefined' && sRatio < window.devicePixelRatio) { sRatio = window.devicePixelRatio}
		if (element == '#BreakdownDetails') { // Gematria Card style
			$('#ChartSpotScroll').addClass('ChartSpotScrollStop'); // full size chart table for mobile devices
			$('#BreakdownDetails').addClass('elemBorderScr'); // add outline for breakdown area
			if (optCompactBreakdown) { $("#BreakdownDetails").attr("style", "padding-top: 1.5em; background-color:"+
				window.getComputedStyle(document.querySelector('body')).getPropertyValue('background-color')+";"); } // extra padding and background color
			else { $("#BreakdownDetails").attr("style", "padding-top: 1.5em; background-color:"+
				window.getComputedStyle(document.querySelector('body')).getPropertyValue('background-color')+";"); }
		}
		if (element == '#ChartSpot' || element == '#BreakdownDetails') { // remove space and backspace labels from Cipher Chart or Gematria Card
			$('#spaceChartBtn').text('');$('#backspaceChartBtn').text('');
		}
		// html2canvas($(element)[0], {allowTaint: false, backgroundColor: window.getComputedStyle(document.querySelector('body')).getPropertyValue('background-color'), width: $(element).outerWidth()+2, height: $(element).outerHeight()+2, scale: sRatio} ).then((canvas) => { // e.g. html2canvas($("#ChartTable")[0]).then ...
		html2canvas($(element)[0], {allowTaint: false, backgroundColor: "rgba(0,0,0,0)", width: $(element).outerWidth()+10, height: $(element).outerHeight()+10, scale: sRatio} ).then((canvas) => { // e.g. html2canvas($("#ChartTable")[0]).then ...
			//allowTaint: true, backgroundColor: "rgba(22,26,34,1.0)" - render white bg as transparent
			//backgroundColor: calcBGhtml2canvas()
			//width: $(element).width(), height: $(element).height() - get proper element dimensions
			//console.log("done ... ");
			//$("#previewImage").append(canvas);

			// imageDataURL = canvas.toDataURL("image/png"); // canvas to "data:image/png;base64, ..."
			imageDataURL = trimCanvas(canvas); // canvas to "data:image/png;base64, ..."

			if (element == '.dateCalcTable2') { // restore date labels as input
				$('#dateDesc1Area').html('<input class="dateDescription" id="dateDesc1" value="'+dateDesc1Saved+'">')
				$('#dateDesc2Area').html('<input class="dateDescription" id="dateDesc2" value="'+dateDesc2Saved+'">')
				$('.dateCalcTable2').removeClass('elemBorderScr') // add outline
			}

			if (element == '#BreakdownDetails') { // restore chart style, remove outline
				$('#BreakdownDetails').removeClass('elemBorderScr') // remove outline for breakdown area
				updateWordBreakdown() // redraw cipher chart
			}

			imgName = imgName.replace(/'/g, '')
			if (imgName == "" || imgName.length >= 200) imgName = getTimestamp()+".png"; // filename for download button (200 char limit)

			// add download button and image data inside centered <div>
			//wnd = window.open(""); // open new window
			//wnd.document.body.innerHTML = "<div style='max-height: 100%; max-width: 100%; position: absolute; top: 50%; left: 50%; -webkit-transform: translate(-50%,-50%); transform: translate(-50%,-50%);'><center><br><a href='"+imageDataURL+"' download='"+imgName+"' style='font-family: arial, sans-serif; color: #dedede' >Download</a></center><br><img src="+canvas.toDataURL("image/png")+"></div>";
			//wnd.document.body.style.backgroundColor = "#000000"; // black background
			if (!refresh) {
				showPrintImagePreview(imageDataURL, imgName, element, sRatio) // show preview panel
			} else {
				$('#imgData').attr("src", imageDataURL) // update image only
				$('#downImgBtn').attr("onclick", "download('"+imgName+"', '"+imageDataURL+"')")
			}
		});
	}
}

function trimCanvas(c) { // remove transparent pixels
	var ctx = c.getContext('2d'),
		copy = document.createElement('canvas'),
		copyCtx = copy.getContext('2d'),
		pixels = ctx.getImageData(0, 0, c.width, c.height),
		l = pixels.data.length,
		i,
		bound = {
			top: null,
			left: null,
			right: null,
			bottom: null
		},
		x, y;

	for (i = 0; i < l; i += 4) {
		if (pixels.data[i+3] !== 0) {
			x = (i / 4) % c.width;
			y = ~~((i / 4) / c.width);
	
			if (bound.top === null) {
				bound.top = y;
			}
			
			if (bound.left === null) {
				bound.left = x; 
			} else if (x < bound.left) {
				bound.left = x;
			}
			
			if (bound.right === null) {
				bound.right = x; 
			} else if (bound.right < x) {
				bound.right = x;
			}
			
			if (bound.bottom === null) {
				bound.bottom = y;
			} else if (bound.bottom < y) {
				bound.bottom = y;
			}
		}
	}
		
	var trimHeight = bound.bottom - bound.top,
			trimWidth = bound.right - bound.left,
			trimmed = ctx.getImageData(bound.left, bound.top, trimWidth, trimHeight);
	
	copyCtx.canvas.width = trimWidth;
	copyCtx.canvas.height = trimHeight;
	copyCtx.putImageData(trimmed, 0, 0);
	
	// open new window with trimmed image:
	// return copyCtx.canvas;
	return copy.toDataURL("image/png");
}

function showPrintImagePreview(imageDataURL, imgName, element, sRatio) {
	$('<div id="darkOverlay" onclick="closePrintImagePreview()"></div>').appendTo('body'); // overlay

	var o = '<div class="printImageContainer">'
	o += '<center><div class="prevBtnArea">'
	o += '<input id="downImgBtn" type="button" value="Save Image" onclick="download(&#39;'+imgName+'&#39;, &#39;'+imageDataURL+'&#39;)">' // &#39; - single quote
	o += '<input class="refreshImgBtn" type="button" value="Refresh" onclick="openImageWindow(&#39;'+element+'&#39;, &#39;'+imgName+'&#39;, +&#39;'+sRatio+'&#39;, true);">'
	o += '</div></center>'
	o += '<div class="imgDataArea"><img id="imgData" src="'+imageDataURL+'"></div>'
	o += '</div>'

	$(o).appendTo('body'); // preview image
	$('body').addClass('noScroll') // prevent scrolling

	btnH = Math.ceil( $('.prevBtnArea').outerHeight() )
	o = 'height: calc(100% - '+btnH+'px);'
	$('.imgDataArea').attr("style", o)
}

function closePrintImagePreview() {
	$('#darkOverlay').remove();
	$('.printImageContainer').remove();
	$('body').removeClass('noScroll') // restore scrolling
	$('#ChartSpotScroll').removeClass('ChartSpotScrollStop'); // reset chart table for mobile devices
}

function getTimestamp() { // 2022-05-03_16-37-11
	var d = new Date()
	var ts = d.getFullYear()+'-'+pad((d.getMonth()+1))+'-'+pad(d.getDate())+'_'+
		pad(d.getHours())+'-'+pad(d.getMinutes())+'-'+pad(d.getSeconds())
	return ts
}

function pad(str, len = 2) { // add leading zeroes
	str = str.toString()
	while (str.length < len) str = "0" + str
	return str
}

function listAllCiphers() { // print cipher names/index to console
	for (i = 0; i < cipherList.length; i++) {
		console.log(i+": "+cipherList[i].cipherName)
	}
}

function exportCiphers() {
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
			'\ttrue, // enabled state, default is "false"\n'+
			'\tfalse, // case sensitive cipher, default is "false"\n'+
			'\tfalse, // multi character/syllable cipher, default is "false"\n'+
			'\tfalse, // wheel cipher, default is "false"\n'+
			'\t"Values are assigned in alphabetical order." // brief description\n'+
		')\n'+
		'*/\n\n'

	out += exportCalcOptions()
	out += "cipherList = [\n"
	for (i = 0; i < cipherList.length; i++) {
		
		var cArr_ = []
		var vArr_ = []
		
		// Read list of characters
		for (m = 0; m < cipherList[i].cArr.length; m++) {
			cArr_.push(cipherList[i].cArr[m]) // codePoint
		}
		
		// Read values for each character
		for (m = 0; m < cipherList[i].vArr.length; m++) {
			vArr_.push(cipherList[i].vArr[m])
		}
		
		out +=
			'\tnew cipher(\n'+
			'\t\t"'+cipherList[i].cipherName+'",\n'+
			'\t\t"'+cipherList[i].cipherCategory+'",\n'+
			'\t\t'+cipherList[i].H+', '+cipherList[i].S+', '+cipherList[i].L+',\n'+
			'\t\t'+JSON.stringify(cArr_)+',\n'+
			'\t\t'+JSON.stringify(vArr_)+',\n'+
			'\t\t'+cipherList[i].diacriticsAsRegular+',\n'+
			'\t\t'+cipherList[i].enabled+',\n'+
			'\t\t'+cipherList[i].caseSensitive+',\n'+
			'\t\t'+cipherList[i].multiCharacter+',\n'+
			'\t\t'+cipherList[i].wheelCipher+',\n'+
			'\t\t"'+cipherList[i].cipherDescription+'"\n'+
			'\t),\n'
	}
	out = out.substring(0, out.length-2) + '\n]' // remove last comma and new line, close array
	console.log(out)

	out = 'data:text/js;charset=utf-8,'+encodeURIComponent(out) // format as text file
	// ciphers_2021-03-26_10-23-52.js
	download("ciphers_"+getTimestamp()+".js", out); // download file
}

function exportCiphersDB(expAllCiph = false) {
	var out = '// ciphers.js\n'
	out += exportCalcOptions()
	out += "cipherList = [\n"
	for (i = 0; i < cipherList.length; i++) {
		if (cipherList[i].enabled || expAllCiph) { // export only enabled ciphers
			var cArr_ = []
			var vArr_ = []
			
			// Read list of characters
			for (m = 0; m < cipherList[i].cArr.length; m++) {
				cArr_.push(cipherList[i].cArr[m]) // codePoint
			}
			
			// Read values for each character
			for (m = 0; m < cipherList[i].vArr.length; m++) {
				vArr_.push(cipherList[i].vArr[m])
			}
			
			out +=
				'\tnew cipher(\n'+
				'\t\t"'+cipherList[i].cipherName+'",\n'+
				'\t\t"'+cipherList[i].cipherCategory+'",\n'+
				'\t\t'+cipherList[i].H+', '+cipherList[i].S+', '+cipherList[i].L+',\n'+
				'\t\t'+JSON.stringify(cArr_)+',\n'+
				'\t\t'+JSON.stringify(vArr_)+',\n'+
				'\t\t'+cipherList[i].diacriticsAsRegular+',\n'+
				'\t\t'+cipherList[i].enabled+',\n'+
				'\t\t'+cipherList[i].caseSensitive+',\n'+
				'\t\t'+cipherList[i].multiCharacter+',\n'+
				'\t\t'+cipherList[i].wheelCipher+',\n'+
				'\t\t"'+cipherList[i].cipherDescription+'"\n'+
				'\t),\n'
		}
	}
	out = out.substring(0, out.length-2) + '\n]' // remove last comma and new line, close array
	return out
}

function exportCalcOptions() {
	var o = "calcOptions = [\n\t"
	for (var i = 0; i < calcOptionsArr.length; i++) {
		o += "\x22"+eval(calcOptionsArr[i])+"\x22,\n\t" // quotes - \x22
	}
	o = o.slice(0,-3) + "\n]\n" // remove comma, new line, tab; new line, close array, new line
	return o
}

function exportHighlighterMatches(histArr) { // highlighter mode controls export mode
	if (histArr.length == 0) return
	if (optFiltCrossCipherMatch) {
		exportCrossCipherMatches(histArr)
	} else if (optFiltSameCipherMatch) {
		exportSameCipherMatches(histArr)
	}
}

function exportSameCipherMatches(histArr) {
	var pVal = [] // 2d array, all phrase values in one cipher for each existing cipher (use index to get cipher name, use index to get phrase)
	var tmp = [] // gematria values for one phrase (all ciphers)
	var g

	for (n = 0; n < cipherList.length; n++) { // for each enabled cipher
		tmp = [] // reset array
		for (i = 0; i < histArr.length; i++) { // for each phrase
			if (cipherList[n].enabled) {
				g = cipherList[n].calcGematria(histArr[i]) // gematria for current phrase in one cipher
			} else {
				g = 0 // value for disabled ciphers
			}
			tmp.push(g) // separate phrase array
		}
		pVal.push(tmp) // add cipher with gematria, pVal[0][1] is cipherList[0], histArr[1]
	}

	var searchArr = [] // list of numbers that occur twice or more
	var matchArr = [] // array with matches within one cipher
	var o = '======= Same Cipher Match =======\n\n\n' // build string for output

	for (p = 0; p < pVal.length; p++) { // for each cipher
		searchArr = [] // reset
		matchArr = countMatches(pVal[p]) // 2d array, number/amount of matches in one cipher

		for (i = 0; i < matchArr.length; i++) { // for all available matches
			if (matchArr[i][1] >= 2) searchArr.push(matchArr[i][0]) // add those that occur twice or more
		}

		searchArr.sort(function(a, b) { // sort ascending order
			return a - b; //  b - a, for descending sort
		});
		if (searchArr[0] == 0) searchArr.splice(0,1) // remove zero (value for disabled ciphers)

		for (i = 0; i < searchArr.length; i++) { // for each valid match
			o += searchArr[i] + ' (' + cipherList[p].cipherName + ')' // 30 (English Ordinal)
			o += '\n================================='
			for (n = 0; n < pVal[p].length; n++) { // for each value in current cipher
				if (pVal[p][n] == searchArr[i]) { // if gematria equals current searched number
					o += '\n"' + histArr[n] + '"' // add "phrase"
				}
			}
			o += '\n\n\n' // number added, new lines
		}
	}

	o = o.substring(0, o.length-3) // remove last new lines

	o = 'data:text/plain;charset=utf-8,'+encodeURIComponent(o) // format as text file
	download(getTimestamp()+"_Same_Cipher_Match_gematria.txt", o); // download file
}

function exportCrossCipherMatches(histArr) { // maybe use highlighter mode to control behavior
	var allVal = [] // all gematria in one array
	var pVal = [] // 2d array, phrase [0], gematria value in cipher
	var tmp = [] // gematria values for one phrase (all ciphers)
	var g

	for (i = 0; i < histArr.length; i++) { // for each phrase
		tmp = [histArr[i]] // reset array, add phrase at index 0
		for (n = 0; n < cipherList.length; n++) { // for each existing cipher
			if (cipherList[n].enabled) {
				g = cipherList[n].calcGematria(histArr[i]) // gematria for current cipher
			} else {
				g = 0 // zero value for disabled ciphers
			}
			tmp.push(g) // separate phrase array
			allVal.push(g) // all gematria array
		}
		pVal.push(tmp) // add phrase with gematria, cipher indices are offset +1
	}

	var matchArr = countMatches(allVal) // 2d array, number/amount of matches
	var searchArr = [] // list of numbers that occur twice or more

	for (i = 0; i < matchArr.length; i++) { // for all available matches
		if (matchArr[i][1] >= 2) searchArr.push(matchArr[i][0]) // add those that occur twice or more
	}
	
	searchArr.sort(function(a, b) { // sort ascending order
		return a - b; //  b - a, for descending sort
	});
	if (searchArr[0] == 0) searchArr.splice(0,1) // remove zero (value for disabled ciphers)

	var nP = true // new phrase flag (used to add cipher names to existing matches)
	var o = '============ Cross Cipher Match ============\n\n\n' // build string for output
	for (i = 0; i < searchArr.length; i++) { // for each valid match
		o += searchArr[i] // number
		o += '\n============================================'
		for (n = 0; n < pVal.length; n++) { // for each phrase
			nP = true // new phrase
			for (m = 0; m < pVal[n].length; m++) { // for each gematria value
				if (pVal[n][m] == searchArr[i] && nP) { // if gematria equals searched number
					o += '\n"' + pVal[n][0] + '" (' + cipherList[m-1].cipherName + ')' // "phrase" (English Ordinal)
					nP = false // current phrase was added
				} else if (pVal[n][m] == searchArr[i] && !nP) { // same phrase, different cipher match
					o += ', (' + cipherList[m-1].cipherName + ')' // , (Reverse Ordinal)
				}
			}
		}
		o += '\n\n\n' // number added, new lines
	}
	o = o.substring(0, o.length-3) // remove last new lines

	o = 'data:text/plain;charset=utf-8,'+encodeURIComponent(o) // format as text file
	download(getTimestamp()+"_Cross_Cipher_Match_gematria.txt", o); // download file
}

// ======================== Color Conversion ========================
// ------------ html2canvas has no support of HSL values ------------

function calcBGhtml2canvas() { // not used
	var element = document.querySelector('body')
	var compStyles = window.getComputedStyle(element)
	var bodyBg = compStyles.getPropertyValue('--body-bg-accent') // ' hsl(222 22% 16%)'
	var colArr = bodyBg.trim().split(" ") // remove leading/trailing spaces, split to array, space as delimiter
	for (i = 0; i < colArr.length; i++) {
		colArr[i] = Number( colArr[i].replace(/[^\d|^\.]/g, '') ) // remove anything that is not a digit or a literal dot, parse as number
	}
	return HSLtoRGB(colArr[0], colArr[1], colArr[2]) // rgb(32,37,50)
}

function HSLtoRGB(h, s, l) {
	var hsv = HSLtoHSV(h, s, l)
	return HSVtoRGB(hsv.h, hsv.s, hsv.v)
}

function HSLtoHSV(h, s, l) {
	h = h / 360, s = s / 100, l = l / 100;
	var _h = h,
		_s,
		_v;

	l *= 2;
	s *= (l <= 1) ? l : 2 - l;
	_v = (l + s) / 2;
	_s = (2 * s) / (l + s);

	return {
		h: _h * 360,
		s: _s * 100,
		v: _v * 100
	};
}

function HSVtoRGB(h, s, v, mode = 0) {
	var r, g, b, i, f, p, q, t;
	h = h / 360, s = s / 100, v = v / 100;

	i = Math.floor(h * 6);
	f = h * 6 - i;
	p = v * (1 - s);
	q = v * (1 - f * s);
	t = v * (1 - (1 - f) * s);
	switch (i % 6) {
		case 0: r = v, g = t, b = p; break;
		case 1: r = q, g = v, b = p; break;
		case 2: r = p, g = v, b = t; break;
		case 3: r = p, g = q, b = v; break;
		case 4: r = t, g = p, b = v; break;
		case 5: r = v, g = p, b = q; break;
	}
	var rgb = ''
	if (mode = 0) { // always
		rgb = 'rgb('+Math.round(r * 255)+','+Math.round(g * 255)+','+Math.round(b * 255)+')'
	} else {
		let hR = numBaseXtoY(Math.round(r * 255), 10, 16) // hex format
		let hG = numBaseXtoY(Math.round(g * 255), 10, 16)
		let hB = numBaseXtoY(Math.round(b * 255), 10, 16)
		rgb = '#'+hR+hG+hB // #000000, colorTheme value
	}
	return rgb
}