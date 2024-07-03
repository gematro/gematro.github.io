// ================ Matrix code rain (HTML5 canvas) =================

function initCodeRain() {

	height_html = $(window).height()

	canvas = document.getElementById("canv")
	ctx = canvas.getContext("2d")

	if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) $('#canv').css({'filter':'blur(1px)'}) // blur effect for Firefox

	// set width and height of the canvas
	w = canvas.width = document.body.offsetWidth
	h = canvas.height = height_html

	// draw a plain color rectangle of width and height same as that of the canvas
	ctx.fillStyle = "hsl("+interfaceHue+","+(22*interfaceSat)+"%,"+(16*interfaceLit)+"%)" // CSS var(--body-bg-accent)
	ctx.fillRect(0, 0, w, h)

	cols = Math.floor(w / 14) + 1 // px
	ypos = Array(cols).fill(0)
}

function matrix() {

	// draw a semitransparent black rectangle on top of previous drawing
	ctx.fillStyle = "#00000010"
	if(navigator.userAgent.toLowerCase().indexOf('firefox') == -1) { // if not Firefox
		// ctx.shadowColor = "rgba(0,0,0,0)" // reset blurred shadows for old characters
		ctx.shadowColor = "hsla(0,0%,0%,0.0)" // reset blurred shadows for old characters
		ctx.shadowBlur = 0 // reset blurred shadows
	}
	ctx.fillRect(0, 0, w, h)

	// set color and font in the drawing context
	ctx.fillStyle = "hsl("+coderainHue+","+(coderainSat*100)+"%,"+(coderainLit*100)+"%)"
	ctx.font = "bold 18pt matrix-font"
	if(navigator.userAgent.toLowerCase().indexOf('firefox') == -1) { // if not Firefox
		ctx.shadowColor = "hsla("+coderainHue+",100%,50%,0.4)"
		ctx.shadowBlur = 4
	}

	var matrixChars = [97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,
		48,49,50,51,52,53,54,55,56,57,36,43,45,42,47,61,37,34,39,35,38,95,40,41,44,46,59,58,63,33,92,124,123,125,60,62,91,93,94,126]
	var aLen = matrixChars.length // glyphs from matrix font
	
	// for each column put a random character at the end
	ypos.forEach((y, ind) => {

		// choose a random character from array
		text = String.fromCharCode(matrixChars[rndInt(0,aLen-1)])

		// x coordinate of the column, y coordinate is already given
		x = ind * 14 // px
		// render the character at (x, y)
		ctx.fillText(text, x, y)

		// randomly reset the end of the column if it's at least 100px high
		if (y > 100 + Math.random() * 10000) ypos[ind] = 0
		// otherwise just move the y coordinate for the column 20px down
		else ypos[ind] = y + 21 // px
	});
}

function rndInt(min, max) { // inclusive
	return Math.floor(Math.random()*(max-min+1)+min)
}

function toggleCodeRain() {
	if (optMatrixCodeRain) {
		clearInterval(code_rain) // reset previous instance
		document.getElementById("canv").style.display = "none"
		initCodeRain() // recalculate canvas size
		code_rain = setInterval(matrix, 50)
		document.getElementById("canv").style.display = ""
		return
	} else {
		clearInterval(code_rain)
		document.getElementById("canv").style.display = "none"
		return
	}
}

toggleCodeRain()