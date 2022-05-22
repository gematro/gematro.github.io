// ============================== Init ==============================

var compactViewportWidth = 911 // viewport width threshold
var mobileUserAgent = navigator.userAgent.match('Mobile')

var cipherList = [] // list of all available ciphers
var cipherListSaved = [] // copy of all initially available ciphers
var defaultCipherArray = [] // default ciphers
var defaultCipherArraySaved = [] // copy of default ciphers
var cCat = []; // list of all available cipher categories

// Layout
var colorMenuColumns = ($(window).width() < 1600) ? 2 : 4 // number of columns inside Color Menu
var encodingMenuColumns = 4 // number of columns inside Encoding menu
var enabledCiphColumns = 4 // number of columns for enabled ciphers table (for phrase)
var optForceTwoColumnLayout = false // force 2 cipher columns
var optColoredCiphers = true // use colored ciphers

var colorControlsMenuOpened = false // color controls menu state
var editCiphersMenuOpened = false // edit ciphers menu state
var dateCalcMenuOpened = false // date calculator menu state
var encodingMenuOpened = false // encoding menu state

var enabledCiphCount = 0 // number of enabled ciphers
var optShowExtraCiphers = false // enable extra ciphers

// Cipher colors
var origColors = [] // preserve original cipher colors
var chkboxColors = [] // individual cipher color modifiers
var globColors = [] // global color modifiers

var sHistory = [] // user search history (history table)
var optPhraseLimit = 5 // word limit to enter input as separate phrases, "End" key

var compactHistoryTable = false // compact mode - vertical cipher names
var optNewPhrasesGoFirst = false // new phrases are inserted at the beginning of history table
var optCompactCiphCount = 8 // compact mode threshold
var optLoadUserHistCiphers = true // load ciphers when CSV file is imported

var optMatrixCodeRain = false // code rain

var optShowOnlyMatching = false // set opacity of nonmatching values to zero

var optNumCalcMethod = 1 // 0 - "Off", 1 - "Full", 2 - "Reduced"
var optLetterWordCount = true // show word/letter count
var optCompactBreakdown = true // compact breakdown - "phrase = 67 (English Ordinal)" is not included inside the chart
var optWordBreakdown = true // word breakdown
var optShowCipherChart = true // cipher breakdown chart

var optGemSubstitutionMode = true // simple substitution of characters with correspondent values
var optGemMultCharPos = false // value of each character is multiplied by character index
var optGemMultCharPosReverse = false // value of each character is multiplied by character index in reverse order

var optFiltSameCipherMatch = false // filter shows only phrases that match in the same cipher
var optFiltCrossCipherMatch = true // filter shows only ciphers that have matching values
var alphaHlt = 0.15 // opacity for values that do not match - change value here and in conf_SOM()

var optAllowPhraseComments = true // allow phrase comments, text inside [...] is not evaluated
var liveDatabaseMode = true // live database mode

var dbPageItems = 15 // number of phrases in one section
var dbScrollItems = 1 // used for scrolling

var optGradientCharts = true // gradient fill for breakdown/cipher charts
var optGradientChartsDefault = optGradientCharts

var interfaceHue = 222 // calculator interface color
var interfaceHueDefault = 222 // value for reset, updated on first run of updateInterfaceHue()
var interfaceSat = 1.0 // interface saturation multiplier
var interfaceSatDefault = 1.0
var interfaceLit = 1.0  // interface lightness multiplier
var interfaceLitDefault = 1.0

var fontHue = 0 // font and outline hue
var fontHueDefault = 0 // value for reset, updated on first run of updateFontHue()
var fontSat = 0 // font saturation
var fontSatDefault = 0
var fontLit = 1.0  // font lightness multiplier
var fontLitDefault = 1.0

var coderainHue = 148 // coderain hue
var coderainHueDefault = 148 // value for reset, updated on first run of updateCoderainHue()
var coderainSat = 0.2 // coderain saturation
var coderainSatDefault = 0.2
var coderainLit = 0.19  // coderain lightness
var coderainLitDefault = 0.19

var calcOptionsArr = [ // used to export/import settings
	"'optNumCalcMethod'+' = '+optNumCalcMethod",
	"'optFiltCrossCipherMatch'+' = '+optFiltCrossCipherMatch",
	"'optFiltSameCipherMatch'+' = '+optFiltSameCipherMatch",
	"'optShowOnlyMatching'+' = '+optShowOnlyMatching",
	"'optNewPhrasesGoFirst'+' = '+optNewPhrasesGoFirst",
	"'optShowExtraCiphers'+' = '+optShowExtraCiphers",
	"'optAllowPhraseComments'+' = '+optAllowPhraseComments",
	"'liveDatabaseMode'+' = '+liveDatabaseMode",
	"'optLetterWordCount'+' = '+optLetterWordCount",
	"'optWordBreakdown'+' = '+optWordBreakdown",
	"'optCompactBreakdown'+' = '+optCompactBreakdown",
	"'optShowCipherChart'+' = '+optShowCipherChart",
	"'optGradientCharts'+' = '+optGradientCharts",
	"'optLoadUserHistCiphers'+' = '+optLoadUserHistCiphers",
	"'optMatrixCodeRain'+' = '+optMatrixCodeRain",
	"'interfaceHue'+' = '+interfaceHue",
	"'interfaceSat'+' = '+interfaceSat",
	"'interfaceLit'+' = '+interfaceLit",
	"'fontHue'+' = '+fontHue",
	"'fontSat'+' = '+fontSat",
	"'fontLit'+' = '+fontLit",
	"'coderainHue'+' = '+coderainHue",
	"'coderainSat'+' = '+coderainSat",
	"'coderainLit'+' = '+coderainLit",
	"'optPhraseLimit'+' = '+optPhraseLimit",
	"'dbPageItems'+' = '+dbPageItems",
	"'dbScrollItems'+' = '+dbScrollItems",
	"'optForceTwoColumnLayout'+' = '+optForceTwoColumnLayout",
	"'optColoredCiphers'+' = '+optColoredCiphers",
	"'optGemSubstitutionMode'+' = '+optGemSubstitutionMode",
	"'optGemMultCharPos'+' = '+optGemMultCharPos",
	"'optGemMultCharPosReverse'+' = '+optGemMultCharPosReverse",
	'"encDefAlphArr"+" = \x27"+String(encPrevAlphStr).replace(/,/g,"")+"\x27"',
	'"encDefVowArr"+" = \x27"+String(encPrevVowStr).replace(/,/g,"")+"\x27"',
	'"encDefExcLetArr"+" = \x27"+String(encPrevExcLetStr).replace(/,/g,"")+"\x27"'
]

var runOnceRestoreCalcSet = true
function initCalc(defSet = false) { // run after page has finished loading
	configureCalcInterface(true)
	if (defSet && typeof calcOpt !== 'undefined') importCalcOptions(calcOptions); // load settings from ciphers.js
	generateRndColors()
	if (runOnceRestoreCalcSet && window.localStorage.getItem('userCalcSettings') !== null) {
		runOnceRestoreCalcSet = false; restoreCalcSettingsLocalStorage(true); return; }
	saveInitialCiphers()
	initCiphers() // update default ciphers
	createCalcMenus()
	enableDefaultCiphers()
	saveCalcSettingsLocalStorage(true) // save default settings
}

function configureCalcInterface(initRun = false) { // switch interface layout (desktop or mobile devices)
	if (optMatrixCodeRain && !initRun) { // update code rain
		clearInterval(code_rain) // reset previous instance
		document.getElementById("canv").style.display = "none"
		initCodeRain() // recalculate canvas size
		code_rain = setInterval(matrix, 50)
		document.getElementById("canv").style.display = ""
	}
	if ($(window).width() < compactViewportWidth) { // viewport width (mobile)
		encodingMenuColumns = 1
		colorMenuColumns = 1
		enabledCiphColumns = 2
		optCompactCiphCount = 4
		chLimit = 17 // character limit, used to switch to a long breakdown style
		maxRowWidth = 20 // one row character limit (long breakdown)
		$('#queryDBbtn').val('Q') // change Query button label
	} else { // desktop
		encodingMenuColumns = 4
		colorMenuColumns = ($(window).width() < 1600) ? 2 : 4
		enabledCiphColumns = 4
		optCompactCiphCount = 8
		chLimit = 30 // character limit, used to switch to a long breakdown style
		maxRowWidth = 36 // one row character limit (long breakdown)
		$('#queryDBbtn').val('Query') // change Query button label
	}
	if (optForceTwoColumnLayout && $(window).width() > compactViewportWidth) { // override layout for desktop
		encodingMenuColumns = 2
		colorMenuColumns = 2
		enabledCiphColumns = 2
	}
}

window.addEventListener('resize', function(){ // update interface on window resize
	if (!mobileUserAgent && navigator.maxTouchPoints <= 1) { // touch keyboard on Windows devices changes window size
		configureCalcInterface();
		updateTables();
	}
})

function displayCalcNotification(msg, timeMs = 1000) {
	if (document.getElementById('calcNotification') !== null) {
		document.getElementById('calcNotification').remove() }
	var alertDiv = $('<div />').appendTo('body');
	alertDiv.attr('id', 'calcNotification');
	alertDiv.html("<span>"+msg+"</span>")
	setTimeout(function() {alertDiv.remove()}, timeMs)
}

function createCalcMenus() {
	createCiphersMenu()
	createOptionsMenu()
	createFeaturesMenu()
	createExportMenu()
	createAboutMenu()
}

function closeAllOpenedMenus() {
	if (colorControlsMenuOpened) toggleColorControlsMenu() // Colors Menu
	if (dateCalcMenuOpened) toggleDateCalcMenu() // Date Calculator
	if (editCiphersMenuOpened) toggleEditCiphersMenu() // Edit Ciphers
	if (encodingMenuOpened) toggleEncodingMenu() // Encoding
}

// ========================= Random Colors ==========================

var rndCol = { H: [], S: [], L: [] } // random colors for new ciphers
function generateRndColors() { rndCol.H = fillColArr(0, 359, 360/12); rndCol.S = fillColArr(20, 70, 10); rndCol.L = fillColArr(55, 70, 5) }
function fillColArr(min, max, step) { var i; var a = []; for (i = min; i <= max; i += step) a.push(i); return a } // inclusive
function getRndIndex(a) { return a[rndInt(0, a.length-1)] }

// ========================== Ciphers Menu ==========================

function createCiphersMenu() { // create menu with all cipher catergories
	var o = document.getElementById("calcOptionsPanel").innerHTML

	o += '<div class="dropdown">'
	o += '<button class="dropbtn">Ciphers</button>'
	o += '<div class="dropdown-content" style="width: 380px;">'

	o += '<div><center>'
	o += '<input class="intBtn3" type="button" value="Empty" onclick="disableAllCiphers()">'
	o += '<input class="intBtn3" type="button" value="Default" onclick="enableDefaultCiphers()">'
	o += '<input class="intBtn3" type="button" value="All (EN)" onclick="enableAllEnglishCiphers()">'
	o += '<input class="intBtn3" type="button" value="All" onclick="enableAllCiphers()">'
	o += '</center></div>'

	o += '<hr style="background-color: var(--separator-accent2); height: 1px; border: none; margin: 0.4em;">'

	o += '<div style="width: 30%; float: left;">'
	for (i = 0; i < cCat.length; i++) {
		o += '<input class="intBtn2 ciphCatButton" type="button" value="'+cCat[i]+'">'
	}

	o += '</div>'

	o += '<div style="width: 70%; float: left;">'
	o += '<div id="menuCiphCatDetailsArea" style="margin: 0em 0.25em 0em 1.25em;">'
	o += '</div></div>'

	o += '</div></div>'

	document.getElementById("calcOptionsPanel").innerHTML = o
	displayCipherCatDetailed(cCat[0]) // open first available category
}

$(document).ready(function(){
	$("body").on("mouseover", ".ciphCatButton", function () { // mouse over cipher category button
		displayCipherCatDetailed( $(this).val() );
	});

	$("body").on("click", ".ciphCatButton", function (e) {
		if (navigator.maxTouchPoints < 1) { // Left Click (desktop)
			toggleCipherCategory( $(this).val() ) // toggle category
		}
	});
});

function displayCipherCatDetailed(curCat) {
	var chk = ""; var o = ""
	if (navigator.maxTouchPoints > 1) {
		o += '<input class="intBtn3" type="button" value="Toggle Category" style="width: 100%; margin-top: 0.1em" onclick="toggleCipherCategory(&quot;'+curCat+'&quot;)">'
		o += '<div style="padding: 0.25em;"></div>'
	}
	o += '<table class="cipherCatDetails"><tbody>'
	for (i = 0; i < cipherList.length; i++) {
		if (cipherList[i].cipherCategory == curCat) {
			if (cipherList[i].enabled) {chk = " checked";} else {chk = ""} // checkbox state
			o += '<tr><td><label class="chkLabel ciphCheckboxLabel2">'+cipherList[i].cipherName+'<input type="checkbox" id="cipher_chkbox'+i+'" onclick="toggleCipher('+i+')"'+chk+'><span class="custChkBox"></span></label></td>'
		}
	}
	o += '</tbody></table>'
	document.getElementById("menuCiphCatDetailsArea").innerHTML = o
}

// =========================== About Menu ===========================

function createAboutMenu() { // create menu with all cipher catergories
	var o = document.getElementById("calcOptionsPanel").innerHTML

	o += '<div class="dropdown">'
	o += '<button class="dropbtn">About</button>'
	o += '<div class="dropdown-content dropdown-about">'

	o += '<center><div class="gematroLogo">'+gematroSvgLogo()+'</div>'
	// o += '<span style="font-size: 70%; color: var(--font-white-3);">by Sean Virroco</span>'
	o += '</center>'
	// o += '<div style="margin: 0.5em;"></div>'
	o += '<div style="margin: 1em;"></div>'
	o += '<input class="intBtn" type="button" value="GitHub Repository" onclick="gotoGitHubRepo()">'
	o += '<div style="margin: 0.5em;"></div>'
	o += '<input class="intBtn" type="button" value="Quickstart Guide" onclick="displayQuickstartGuide()">'
	o += '<div style="margin: 0.5em;"></div>'
	o += '<input class="intBtn" type="button" value="Contacts" onclick="displayContactInfo()">'

	o += '</div></div>'

	document.getElementById("calcOptionsPanel").innerHTML = o
}

function gotoGitHubRepo() { window.open("https://github.com/gematro/gematro.github.io", "_blank") }

function gematroSvgLogo() {
	return '<svg xmlns="http://www.w3.org/2000/svg" width="802.4" height="76.4" viewBox="0 0 2006 191"><defs><style>.cls-1 {fill: #bababa;fill-rule: evenodd;}</style></defs><path id="gematro_svg" data-name="gematroSVG" class="cls-1" d="M192.556,55.8L238,56l0.143-12.972q0-24.223-10.351-33.474T188.592,0.3H50.512q-29.07,0-39.31,9.47T0.961,45.23V145.873q0,26.21,10.24,35.676t39.31,9.47h138.08q29.07,0,39.31-9.47t10.241-35.676V80.026H116.8V113.94h75.757v40.522H47.429V35.32H192.556V55.8Zm332.1,135.218V155.343h-160.1V108.435h91.833V75.621H364.552V34h157.68V0.3H317.644V191.019H524.655Zm104.386,0V62.848l86.328,105.268h9.03L809.625,59.765V191.019h43.164V0.3H815.351L722.417,113.5,629.041,0.3H591.823V191.019h37.218Zm326.153,0,24-41.843H1105.39l24,41.843h52.19L1066.63,0.3h-44.71L908.726,191.019h46.468ZM1041.96,34.88l44.49,79.5H999.018Zm368.44-.44V0.3H1179.6V34.439h92.06v156.58h46.46V34.439h92.28Zm228.7,2.2q4.515,3.525,4.52,11.892V70.556q0,8.372-4.52,11.892t-16.63,3.524H1516.33V33.118h106.14Q1634.59,33.118,1639.1,36.642ZM1516.33,191.019V118.785h43.82l79.94,72.234h66.73l-90.73-72.234h26.2q23.565,0,34.14-8.588T1687,82.228V37.3q0-19.6-10.57-28.3t-34.14-8.7H1470.52V191.019h45.81Zm289.15-155.7H1959.2V154.462H1805.48V35.32Zm-46.47,110.553q0,26.21,10.13,35.676t39.42,9.47h147.55q29.07,0,39.31-9.47t10.24-35.676V45.23q0-25.983-10.02-35.456T1956.11,0.3H1808.56q-29.28,0-39.42,9.47T1759.01,45.23V145.873Z"/></svg>'
}

// ========================= Options Menu ===========================

function createOptionsMenu() {

	var o = document.getElementById("calcOptionsPanel").innerHTML

	o += '<div class="dropdown">'
	o += '<button class="dropbtn">Options</button>'
	o += '<div class="dropdown-content-opt">'

	o += create_NumCalc() // Number Calculation

	// get checkbox states
	var CCMstate = ""; var SCMstate = ""; var SOMstate = ""; var SECstate = "";
	var APCstate = ""; var LDMstate = ""; var NPGFstate = ""; var LWCstate = "";
	var WBstate = ""; var CBstate = ""; var CCstate = ""; var GCstate = "";
	var SWCstate = ""; var MCRstate = "";

	if (optFiltCrossCipherMatch) CCMstate = "checked" // Cross Cipher Match
	if (optFiltSameCipherMatch) SCMstate = "checked" // Same Cipher Match
	if (optShowOnlyMatching) SOMstate = "checked" // Show Only Matching

	if (optShowExtraCiphers) SECstate = "checked" // Show Extra Ciphers
	if (optAllowPhraseComments) APCstate = "checked" // Allow Phrase Comments
	if (liveDatabaseMode) LDMstate = "checked" // Live Database Mode

	if (optNewPhrasesGoFirst) NPGFstate = "checked" // New Phrases Go First

	if (optLetterWordCount) LWCstate = "checked" // Letter/Word Count
	if (optWordBreakdown) WBstate = "checked" // Word Breakdown
	if (optCompactBreakdown) CBstate = "checked" // Compact Breakdown
	if (optShowCipherChart) CCstate = "checked" // Cipher Chart

	if (optGradientCharts) GCstate = "checked" // Gradient Charts

	if (optLoadUserHistCiphers) SWCstate = "checked" // Switch Ciphers (CSV)
	if (optMatrixCodeRain) MCRstate = "checked" // Matrix Code Rain

	o += '<div class="optionElement"><label class="chkLabel ciphCheckboxLabel2">Matrix Code Rain<input type="checkbox" id="chkbox_MCR" onclick="conf_MCR()" '+MCRstate+'><span class="custChkBox"></span></label></div>'
	o += '<div style="margin: 1em"></div>'
	o += '<div class="optionElement"><label class="chkLabel ciphCheckboxLabel2">Cross Cipher Match<input type="checkbox" id="chkbox_CCM" onclick="conf_CCM()" '+CCMstate+'><span class="custChkBox"></span></label></div>'
	o += '<div class="optionElement"><label class="chkLabel ciphCheckboxLabel2">Same Cipher Match<input type="checkbox" id="chkbox_SCM" onclick="conf_SCM()" '+SCMstate+'><span class="custChkBox"></span></label></div>'
	o += '<div class="optionElement"><label class="chkLabel ciphCheckboxLabel2">Show Only Matching<input type="checkbox" id="chkbox_SOM" onclick="conf_SOM()" '+SOMstate+'><span class="custChkBox"></span></label></div>'
	o += '<div style="margin: 1em"></div>'
	o += '<div class="optionElement" id="showExtraCiphOption"><label class="chkLabel ciphCheckboxLabel2">Show Extra Ciphers<input type="checkbox" id="chkbox_SEC" onclick="conf_SEC()" '+SECstate+'><span class="custChkBox"></span></label></div>'
	o += '<div class="optionElement"><label class="chkLabel ciphCheckboxLabel2">Ignore Comments [...]<input type="checkbox" id="chkbox_APC" onclick="conf_APC()" '+APCstate+'><span class="custChkBox"></span></label></div>'
	o += '<div class="optionElement"><label class="chkLabel ciphCheckboxLabel2">Live Database Mode<input type="checkbox" id="chkbox_LDM" onclick="conf_LDM()" '+LDMstate+'><span class="custChkBox"></span></label></div>'
	o += '<div style="margin: 1em"></div>'
	o += '<div class="optionElement"><label class="chkLabel ciphCheckboxLabel2">New Phrases Go First<input type="checkbox" id="chkbox_NPGF" onclick="conf_NPGF()" '+NPGFstate+'><span class="custChkBox"></span></label></div>'
	o += '<div style="margin: 1em"></div>'
	o += '<div class="dbOptionsBox" style="border: 1px solid var(--border-accent) !important;">'
	o += '<span class="optionTableLabel">Phrases on DB page</span><input id="dbPageItemsBox" onchange="conf_DPI()" type="text" value="'+dbPageItems+'">'
	o += '</div>'
	o += '<div class="dbOptionsBox">'
	o += '<span class="optionTableLabel">Scroll DB by lines</span><input id="dbScrollItemsBox" onchange="conf_DSI()" type="text" value="'+dbScrollItems+'">'
	o += '</div>'
	o += '<div style="margin: 1em"></div>'
	o += '<div class="optionElement"><label class="chkLabel ciphCheckboxLabel2">Letter/Word Count<input type="checkbox" id="chkbox_LWC" onclick="conf_LWC()" '+LWCstate+'><span class="custChkBox"></span></label></div>'
	o += '<div class="optionElement"><label class="chkLabel ciphCheckboxLabel2">Word Breakdown<input type="checkbox" id="chkbox_WB" onclick="conf_WB()" '+WBstate+'><span class="custChkBox"></span></label></div>'
	o += '<div class="optionElement"><label class="chkLabel ciphCheckboxLabel2">Compact Breakdown<input type="checkbox" id="chkbox_CB" onclick="conf_CB()" '+CBstate+'><span class="custChkBox"></span></label></div>'
	o += '<div class="optionElement"><label class="chkLabel ciphCheckboxLabel2">Cipher Chart<input type="checkbox" id="chkbox_CC" onclick="conf_CC()" '+CCstate+'><span class="custChkBox"></span></label></div>'
	o += '<div style="margin: 1em"></div>'
	o += '<div class="optionElement"><label class="chkLabel ciphCheckboxLabel2">Gradient Charts<input type="checkbox" id="chkbox_GC" onclick="conf_GC()" '+GCstate+'><span class="custChkBox"></span></label></div>'
	o += '<div class="optionElement"><label class="chkLabel ciphCheckboxLabel2">Switch Ciphers (CSV)<input type="checkbox" id="chkbox_SWC" onclick="conf_SWC()" '+SWCstate+'><span class="custChkBox"></span></label></div>'
	o += '<div style="margin: 1em"></div>'

	o += '</div></div>'

	document.getElementById("calcOptionsPanel").innerHTML = o
}

function conf_SEC() { // Show Extra Ciphers
	optShowExtraCiphers = !optShowExtraCiphers
	if (optShowExtraCiphers) {
		if (cCat.indexOf("Extra") == -1) cCat.push("Extra") // add Extra category
	} else {
		if (cCat.indexOf("Extra") !== -1) cCat.splice(cCat.indexOf("Extra"),1) // remove Extra category
	}
	document.getElementById("calcOptionsPanel").innerHTML = "" // redraw menu
	createCalcMenus()
	if (userDBlive.length !== 0) { // restore controls if live database is loaded
		$("#clearDBqueryBtn").removeClass("hideValue") // clear button
		$("#unloadDBBtn").removeClass("hideValue") // unload database button
		$("#btn-export-db-query").removeClass("hideValue") // export button
	}
}

function conf_CCM() { // Cross Cipher Match
	optFiltCrossCipherMatch = !optFiltCrossCipherMatch
	if (optFiltCrossCipherMatch) {
		optFiltSameCipherMatch = false
		chkSCM = document.getElementById("chkbox_SCM")
		if (chkSCM !== null) chkSCM.checked = false
	} else if (!optFiltCrossCipherMatch && !optFiltSameCipherMatch) {
		optFiltCrossCipherMatch = true // can't disable both, revert to cross match as default
		chkCCM = document.getElementById("chkbox_CCM")
		if (chkCCM !== null) chkCCM.checked = true
	}
}

function conf_SCM() { // Same Cipher Match
	optFiltSameCipherMatch = !optFiltSameCipherMatch
	if (optFiltSameCipherMatch) {
		optFiltCrossCipherMatch = false
		chkCCM = document.getElementById("chkbox_CCM")
		if (chkCCM !== null) chkCCM.checked = false
	} else if (!optFiltCrossCipherMatch && !optFiltSameCipherMatch) {
		optFiltCrossCipherMatch = true // can't disable both, revert to cross match as default
		chkCCM = document.getElementById("chkbox_CCM")
		if (chkCCM !== null) chkCCM.checked = true
	}
}

function conf_SOM() { // Show Only Matching
	optShowOnlyMatching = !optShowOnlyMatching
	if (optShowOnlyMatching) { alphaHlt = 0; } else { alphaHlt = 0.15; } 
	if (optFiltCrossCipherMatch) {
		updateTables()
	} else if (optFiltSameCipherMatch) {
		updateHistoryTableSameCiphMatch()
	}
}

function conf_APC() { // Allow Phrase Comments
	optAllowPhraseComments = !optAllowPhraseComments
	updateTables()
}

function conf_LWC() { // Letter/Word Count
	optLetterWordCount = !optLetterWordCount
	updateWordBreakdown()
}

function conf_WB() { // Word Breakdown
	optWordBreakdown = !optWordBreakdown
	updateWordBreakdown()
}

function conf_CB() { // Compact Breakdown
	optCompactBreakdown = !optCompactBreakdown
	updateWordBreakdown()
}

function conf_CC() { // Cipher Chart
	optShowCipherChart = !optShowCipherChart
	updateWordBreakdown()
	element = document.getElementById("ChartSpot")
	element.classList.toggle("hideValue")
}

function conf_GC() { // Gradient Charts
	optGradientCharts = !optGradientCharts
	updateWordBreakdown()
}

function conf_SWC() { // Switch Ciphers (CSV)
	optLoadUserHistCiphers = !optLoadUserHistCiphers
}

function conf_LDM() { // Live Database Mode
	liveDatabaseMode = !liveDatabaseMode
}

function conf_NPGF() { // New Phrases Go First
	optNewPhrasesGoFirst = !optNewPhrasesGoFirst
}

function conf_DPI() { // Database Page Items
	var element = document.getElementById("dbPageItemsBox")
	dbPageItems = Number(element.value)
	if (document.getElementById("QueryTable") !== null) { // redraw query table if it exists
		st = Number( document.getElementById('queryPosInput').value )
		if (st < 0) {
			st = 0
			$(this).val(0)
		}
		n = dbPageItems
		$("#queryArea").html() // clear previous table
		updateDatabaseQueryTable(st, n) // redraw table at new position
	}
}

function conf_DSI() { // Database Scroll Items
	var element = document.getElementById("dbScrollItemsBox")
	dbScrollItems = Number(element.value)
}

function conf_MCR() { // Matrix Code Rain
	optMatrixCodeRain = !optMatrixCodeRain
	toggleCodeRain()
}

function create_NumCalc() { // Number Calculation
	var o = ""
	var fullNumCalcState = ''; var redNumCalcState = ''; var offNumCalcState = '';
	if (optNumCalcMethod == 1) { fullNumCalcState = 'checked' }
	else if (optNumCalcMethod == 2) { redNumCalcState = 'checked' }
	else if (optNumCalcMethod == 0) { offNumCalcState = 'checked' }
	o += '<table class="optionElementTable"><tbody>'
	o += '<tr><td colspan=3><span>Number Calculation</span></td></tr>'
	o += '<tr><td><label class="chkLabel" style="display: initial; padding-left: 0;"><input type="checkbox" id="chkbox_fullNumCalc" onclick="conf_NumCalc(1)" '+fullNumCalcState+'><span class="custChkBox"></span></label>'
	o += '<br><span class="optionTableLabel">Full</span></td>'
	o += '<td><label class="chkLabel" style="display: initial; padding-left: 0;"><input type="checkbox" id="chkbox_redNumCalc" onclick="conf_NumCalc(2)" '+redNumCalcState+'><span class="custChkBox"></span></label>'
	o += '<br><span class="optionTableLabel">Reduced</span></td>'
	o += '<td><label class="chkLabel" style="display: initial; padding-left: 0;"><input type="checkbox" id="chkbox_offNumCalc" onclick="conf_NumCalc(0)" '+offNumCalcState+'><span class="custChkBox"></span></label>'
	o += '<br><span class="optionTableLabel">Off</span></td></tr>'
	o += '</tbody></table>'
	return o
}
function conf_NumCalc(mode) { // Number Calculation
	optNumCalcMethod = mode
	if (mode == 1) {
		document.getElementById("chkbox_fullNumCalc").checked = true
		document.getElementById("chkbox_redNumCalc").checked = false
		document.getElementById("chkbox_offNumCalc").checked = false
	} else if (mode == 2) {
		document.getElementById("chkbox_redNumCalc").checked = true
		document.getElementById("chkbox_fullNumCalc").checked = false
		document.getElementById("chkbox_offNumCalc").checked = false
	} else if (mode == 0) {
		document.getElementById("chkbox_offNumCalc").checked = true
		document.getElementById("chkbox_fullNumCalc").checked = false
		document.getElementById("chkbox_redNumCalc").checked = false
	}
	updateWordBreakdown()
	updateTables()
}

function create_GemCalc() { // Gematria Calculation method
	var o = ""
	var subGemCalcState = ''; var multGemCalcState = ''; var multRevGemCalcState = '';
	if (optGemSubstitutionMode) { subGemCalcState = 'checked' }
	else if (optGemMultCharPos) { multGemCalcState = 'checked' }
	else if (optGemMultCharPosReverse) { multRevGemCalcState = 'checked' }
	o += '<table class="optionElementTable" style="margin: 0em auto 1em auto; width: 210px;"><tbody>'
	o += '<tr><td colspan=3><span>Gematria Calculation</span></td></tr>'
	o += '<tr><td><label class="chkLabel" style="display: initial; padding-left: 0;"><input type="checkbox" id="chkbox_subGemCalc" onclick="conf_GemCalc(&quot;sub&quot;)" '+subGemCalcState+'><span class="custChkBox"></span></label>'
	o += '<br><span class="optionTableLabel">Regular</span></td>'
	o += '<td><label class="chkLabel" style="display: initial; padding-left: 0;"><input type="checkbox" id="chkbox_multGemCalc" onclick="conf_GemCalc(&quot;mult&quot;)" '+multGemCalcState+'><span class="custChkBox"></span></label>'
	o += '<br><span class="optionTableLabel">Multiply</span></td>'
	o += '<td><label class="chkLabel" style="display: initial; padding-left: 0;"><input type="checkbox" id="chkbox_multRevGemCalc" onclick="conf_GemCalc(&quot;multRev&quot;)" '+multRevGemCalcState+'><span class="custChkBox"></span></label>'
	o += '<br><span class="optionTableLabel">Rev. Mult.</span></td></tr>'
	o += '</tbody></table>'
	return o
}
function conf_GemCalc(mode) { // Gematria Calculation
	if (mode == "sub") {
		document.getElementById("chkbox_subGemCalc").checked = true
		document.getElementById("chkbox_multGemCalc").checked = false
		document.getElementById("chkbox_multRevGemCalc").checked = false
		optGemSubstitutionMode = true
		optGemMultCharPos = false
		optGemMultCharPosReverse = false
	} else if (mode == "mult") {
		document.getElementById("chkbox_subGemCalc").checked = false
		document.getElementById("chkbox_multGemCalc").checked = true
		document.getElementById("chkbox_multRevGemCalc").checked = false
		optGemSubstitutionMode = false
		optGemMultCharPos = true
		optGemMultCharPosReverse = false
	} else if (mode == "multRev") {
		document.getElementById("chkbox_subGemCalc").checked = false
		document.getElementById("chkbox_multGemCalc").checked = false
		document.getElementById("chkbox_multRevGemCalc").checked = true
		optGemSubstitutionMode = false
		optGemMultCharPos = false
		optGemMultCharPosReverse = true
	}
	updateWordBreakdown()
	updateTables()
}

// ========================== Export Menu ===========================

function createExportMenu() {
	
	var o = document.getElementById("calcOptionsPanel").innerHTML

	o += '<div class="dropdown">' // Options drop down hover menu
	o += '<button class="dropbtn">Export</button>'
	o += '<div class="dropdown-content">'

	o += '<input id="btn-print-cipher-png" class="intBtn" type="button" value="Print Cipher Chart">' // cipher chart preview
	o += '<div style="margin: 0.5em;"></div>'
	o += '<input id="btn-print-history-png" class="intBtn" type="button" value="Print History Table">' // history table preview
	o += '<div style="margin: 0.5em;"></div>'
	o += '<input id="btn-print-word-break-png" class="intBtn" type="button" value="Print Word Breakdown">' // print word breakdown table
	o += '<div style="margin: 0.5em;"></div>'
	o += '<input id="btn-print-breakdown-details-png" class="intBtn" type="button" value="Print Gematria Card">' // print detailed breakdown
	o += '<div style="margin: 0.5em;"></div>'
	o += '<input id="btn-num-props-png" class="intBtn" type="button" value="Print Number Properties">' // print number properties
	o += '<div style="margin: 0.5em;"></div>'
	o += '<input id="btn-date-calc-png" class="intBtn" type="button" value="Print Date Durations">' // print date durations
	
	o += '<hr style="background-color: var(--separator-accent2); height: 1px; border: none; margin: 0.75em;">'

	o += '<input type="file" id="importFileDummy" style="display: none;">' // dummy item for file import
	o += '<label for="importFileDummy" class="intBtn" style="text-align: center; box-sizing: border-box;">Import File</label>' // import file
	o += '<div style="margin: 0.5em;"></div>'
	o += '<input type="file" id="importFileDummyDict" style="display: none;">' // dummy item for file import
	o += '<label for="importFileDummyDict" class="intBtn" style="text-align: center; box-sizing: border-box;">Create Database (TXT)</label>' // create dictionary from file
	o += '<div style="margin: 0.5em;"></div>'
	o += '<input id="btn-export-history-png" class="intBtn" type="button" value="Export History (CSV)">' // export history as CSV file
	o += '<div style="margin: 0.5em;"></div>'
	o += '<input id="btn-export-matches-txt" class="intBtn" type="button" value="Export Matches (TXT)">' // export available same/cross cipher matches
	o += '<div style="margin: 0.5em;"></div>'
	o += '<input id="btn-export-db-query" class="intBtn hideValue" type="button" value="Export DB Query (CSV)">' // export database query
	
	o += '<hr style="background-color: var(--separator-accent2); height: 1px; border: none; margin: 0.75em;">'

	o += '<div style="margin: 0.5em;"></div>'
	o += '<table style="width: 100%; border-spacing: 0px;"><tbody><tr>'
	o += '<td style="padding: 0em;">'
	o += '<input id="btn-save-settings" class="intBtn" type="button" value="Save">' // save calculator settings in localStorage
	o += '</td><td style="padding: 0em 0em 0em 0.5em;">'
	o += '<input id="btn-restore-settings" class="intBtn" type="button" value="Load">' // restore calculator settings from localStorage
	o += '</td><td style="padding: 0em 0em 0em 0.5em;">'
	o += '<input id="btn-reset-settings" class="intBtn" type="button" value="Reset">' // reset calculator settings in localStorage
	o += '</td>'
	o += '</tr></tbody></table>'

	o += '<div style="margin: 0.5em;"></div>'
	o += '<input id="btn-export-ciphers" class="intBtn" type="button" value="Export Settings (JS)">' // export all available ciphers

	o += '</div></div>'
	document.getElementById("calcOptionsPanel").innerHTML = o
}

// ========================= Color Functions ========================

function createFeaturesMenu() {
	var o = document.getElementById("calcOptionsPanel").innerHTML

	o += '<div class="dropdown">'
	o += '<button class="dropbtn">Features</button>'
	o += '<div class="dropdown-content" style="width: 216px; left: -90px;">'

	o += create_GemCalc() // Gematria Calculation method

	o += '<input class="intBtn" type="button" value="Date Calculator" onclick="toggleDateCalcMenu()">'
	o += '<div style="margin: 0.5em;"></div>'
	o += '<input class="intBtn" type="button" value="Color Controls" onclick="toggleColorControlsMenu()">'
	o += '<div style="margin: 0.5em;"></div>'
	o += '<input id="edCiphBtn" class="intBtn" type="button" value="Edit Ciphers" onclick="toggleEditCiphersMenu()">'
	o += '<div style="margin: 0.5em;"></div>'
	o += '<input class="intBtn" type="button" value="Encoding" onclick="toggleEncodingMenu()">'

	o += '<hr style="background-color: var(--separator-accent2); height: 1px; border: none; margin: 0.75em;">'

	o += '<input class="intBtn" type="button" value="Find Matches" onclick="updateHistoryTableAutoHlt()">'
	o += '<div style="margin: 0.5em;"></div>'
	o += '<input class="intBtn" type="button" value="Enter As Words" onclick="phraseBoxKeypress(35)">' // "End" keystroke
	o += create_PL() // Phrase Limit (End)
	o += '<div style="margin: 0.5em;"></div>'
	o += '<input id="clearDBqueryBtn" class="intBtn hideValue" type="button" value="Clear DB Query" onclick="clearDatabaseQueryTable()">' // clear database query
	o += '<div style="margin: 0.5em;"></div>'
	o += '<input id="unloadDBBtn" class="intBtn hideValue" type="button" value="Unload Database" onclick="unloadDatabase()">' // unload database
	o += '<div style="margin: 0.5em;"></div>'
	o += '<input class="intBtn" type="button" value="Clear History" onclick="phraseBoxKeypress(36)">' // "Home" keystroke

	o += '</div></div>'
	document.getElementById("calcOptionsPanel").innerHTML = o
}
function create_PL() { // Phrase Limit (End)
	var o = ""
	o += '<div class="enterAsWordsLimit">'
	o += '<span class="optionTableLabel">Word limit:</span><input id="phrLimitBox" onchange="conf_PL()" type="text" value="'+optPhraseLimit+'">'
	o += '</div>'
	return o
}
function conf_PL() {
	var pLimit = document.getElementById("phrLimitBox")
	optPhraseLimit = Number(pLimit.value)
}

function toggleColorControlsMenu(redraw = false) { // display control menu to adjust each cipher
	if (!colorControlsMenuOpened || redraw) {

		if (!redraw) {
			closeAllOpenedMenus()
		} else {
			document.getElementById("colorControlsMenuArea").innerHTML = "" // clear previous layout
		}

		colorControlsMenuOpened = true
		
		var cur_ciph_index = 0 // index of current of enabled cipher that will be added to the table (total # of ciphers added so far + 1)
		var new_row_opened = false // condition to open new row inside table
		var ciph_in_row = 0 // count ciphers in current row

		var o = '<div class="colorControlsBG">'
		o += '<input class="closeMenuBtn" type="button" value="&#215;" onclick="closeAllOpenedMenus()">'

		o += '<table class="ciphToggleContainer"><tbody>'
		
		for (i = 0; i < cipherList.length; i++) {
			cur_ciph_index++
			if (!new_row_opened) { // check if new row has to be opened
				o += '<tr>'
				new_row_opened = true
			}
			var chk = ""
			if (ciph_in_row < colorMenuColumns) { // until number of ciphers in row equals number of columns
				if (cipherList[i].enabled) {
					o += '<td><span class="ciphCheckboxLabel">'+cipherList[i].cipherName+'</span></td>'
					o += '<td><input type="number" step="2" min="-360" max="360" value="'+chkboxColors[i].H+'" class="colSlider" id="sliderHue'+i+'" oninput="changeCipherColors(&quot;sliderHue'+i+'&quot;, &quot;Hue&quot;, '+i+')"></td>'
					o += '<td><input type="number" step="1" min="-100" max="100" value="'+chkboxColors[i].S+'" class="colSlider" id="sliderSaturation'+i+'" oninput="changeCipherColors(&quot;sliderSaturation'+i+'&quot;, &quot;Saturation&quot;, '+i+')"></td>'
					o += '<td><input type="number" step="1" min="-100" max="100" value="'+chkboxColors[i].L+'" class="colSlider" id="sliderLightness'+i+'" oninput="changeCipherColors(&quot;sliderLightness'+i+'&quot;, &quot;Lightness&quot;, '+i+')"></td>'
					o += '<td><input type="text" value="" class="cipherColValueBox" id="cipherHSL'+i+'"></td>'
					o += '<td style="min-width: 16px;"></td>'
					ciph_in_row++
				}
			}
			if (ciph_in_row == colorMenuColumns) { // check if row needs to be closed
				o += '</tr>'
				ciph_in_row = 0 // reset cipher count
				new_row_opened = false
			}
		}
		o += '</tbody></table>'

		// global color controls
		o += '<center>'
		o += '<table class="globColCtrlTable">'
		o += '<tr><td class="colLabel">All Ciphers Color:</td>'
		o += '<td class="colLabelSmall">Hue</td>'
		o += '<td><input type="number" step="2" min="-360" max="360" value="'+globColors.H+'" class="colSlider2" id="globalSliderHue" oninput="changeCipherColors(&quot;globalSliderHue&quot;, &quot;Hue&quot;)"></td>'
		o += '<td class="colLabelSmall">Saturation</td>'
		o += '<td><input type="number" step="1" min="-100" max="100" value="'+globColors.S+'" class="colSlider2" id="globalSliderSaturation" oninput="changeCipherColors(&quot;globalSliderSaturation&quot;, &quot;Saturation&quot;)"></td>'
		o += '<td class="colLabelSmall">Lightness</td>'
		o += '<td><input type="number" step="1" min="-100" max="100" value="'+globColors.L+'" class="colSlider2" id="globalSliderLightness" oninput="changeCipherColors(&quot;globalSliderLightness&quot;, &quot;Lightness&quot;)"></td>'
		o += '</tr>'

		// interface color controls
		o += '<tr><td class="colLabel" style="padding-right: 0.4em;">Interface Color:</td>'
		o += '<td class="colLabelSmall">Hue</td>'
		o += '<td><input type="number" step="1" min="0" max="359" value="'+interfaceHue+'" class="colSlider2" id="interfaceHueSlider" oninput="updateInterfaceHue()"></td>'
		o += '<td class="colLabelSmall">Saturation</td>'
		o += '<td><input type="number" step="0.1" min="0" max="10.0" value="'+interfaceSat+'" class="colSlider2" id="interfaceSatSlider" oninput="updateInterfaceSat()"></td>'
		o += '<td class="colLabelSmall">Lightness</td>'
		o += '<td><input type="number" step="0.01" min="0" max="10.0" value="'+interfaceLit+'" class="colSlider2" id="interfaceLitSlider" oninput="updateInterfaceLit()"></td>'
		o += '</tr>'
		// font and outline color controls
		o += '<tr><td class="colLabel" style="padding-right: 0.4em;">Font & Outline Color:</td>'
		o += '<td class="colLabelSmall">Hue</td>'
		o += '<td><input type="number" step="1" min="0" max="359" value="'+fontHue+'" class="colSlider2" id="fontHueSlider" oninput="updateFontHue()"></td>'
		o += '<td class="colLabelSmall">Saturation</td>'
		o += '<td><input type="number" step="0.01" min="0" max="1.0" value="'+fontSat+'" class="colSlider2" id="fontSatSlider" oninput="updateFontSat()"></td>'
		o += '<td class="colLabelSmall">Lightness</td>'
		o += '<td><input type="number" step="0.01" min="0" max="10.0" value="'+fontLit+'" class="colSlider2" id="fontLitSlider" oninput="updateFontLit()"></td>'
		o += '</tr>'
		// font and outline color controls
		o += '<tr><td class="colLabel" style="padding-right: 0.4em;">Code Rain Color:</td>'
		o += '<td class="colLabelSmall">Hue</td>'
		o += '<td><input type="number" step="1" min="0" max="359" value="'+coderainHue+'" class="colSlider2" id="coderainHueSlider" oninput="updateCoderainHue()"></td>'
		o += '<td class="colLabelSmall">Saturation</td>'
		o += '<td><input type="number" step="0.01" min="0" max="1.0" value="'+coderainSat+'" class="colSlider2" id="coderainSatSlider" oninput="updateCoderainSat()"></td>'
		o += '<td class="colLabelSmall">Lightness</td>'
		o += '<td><input type="number" step="0.01" min="0" max="1.0" value="'+coderainLit+'" class="colSlider2" id="coderainLitSlider" oninput="updateCoderainLit()"></td>'
		o += '</tr></table>'
		// checkboxes, reset button
		chkTPstate = (optForceTwoColumnLayout) ? " checked" : ""
		chkCCstate = (optColoredCiphers) ? " checked" : ""
		o += '<div style="margin: 1em"></div>'
		o += '<table class="globColCtrlTable">'
		o += '<tr>'
		o += '<td><label class="chkLabel colLabelSmallEnc">Two Columns<input type="checkbox" id="chkbox_forceTwoColumns" onclick="forceTwoColumnLayout()"'+chkTPstate+'><span class="custChkBox"></span></label></td>'
		o += '<td><label class="chkLabel colLabelSmallEnc">Colored Ciphers<input type="checkbox" id="chkbox_colCiphers"'+chkCCstate+' onclick="toggleColoredCiphers()"><span class="custChkBox"></span></label></td>'
		o += '<td><input id="resetColorsButton" class="intBtn" style="width: auto;" type="button" value="Reset Colors" onclick="resetColorControls()"></td>'
		o += '</tr></table>'
		o += '</center>'

		o += '</div>' // colorControlsBG
		
		document.getElementById("colorControlsMenuArea").innerHTML += o
		populateColorValues() // update values for controls
	} else {
		document.getElementById("colorControlsMenuArea").innerHTML = "" // clear
		colorControlsMenuOpened = false
	}
}

function forceTwoColumnLayout() {
	optForceTwoColumnLayout = !optForceTwoColumnLayout
	configureCalcInterface()
	updateTables()
}

function toggleColoredCiphers() {
	optColoredCiphers = !optColoredCiphers
	updateTables()
}

function updateInterfaceColor(firstrun = false) { // change interface color
	updateInterfaceHue(firstrun)
	updateInterfaceSat(firstrun)
	updateInterfaceLit(firstrun)
	updateFontHue(firstrun)
	updateFontSat(firstrun)
	updateFontLit(firstrun)
	updateCoderainHue(firstrun)
	updateCoderainSat(firstrun)
	updateCoderainLit(firstrun)
}

function updateInterfaceHue(firstrun = false) { // change interface hue
	// update hue from slider if element exists
	if (document.getElementById("interfaceHueSlider") !== null) interfaceHue = document.getElementById("interfaceHueSlider").value
	var root = document.documentElement
	root.style.setProperty("--global-hue", interfaceHue.toString()) // update :root CSS variable
	if (firstrun) interfaceHueDefault = interfaceHue // set default color for reset
}
function updateInterfaceSat(firstrun = false) { // change interface saturation
	// update saturation from slider if element exists
	if (document.getElementById("interfaceSatSlider") !== null) interfaceSat = document.getElementById("interfaceSatSlider").value
	var root = document.documentElement
	root.style.setProperty("--global-sat", interfaceSat.toString()) // update :root CSS variable
	if (firstrun) interfaceSatDefault = interfaceSat // set default color for reset
}
function updateInterfaceLit(firstrun = false) { // change interface lightness
	// update lightness from slider if element exists
	if (document.getElementById("interfaceLitSlider") !== null) interfaceLit = document.getElementById("interfaceLitSlider").value
	var root = document.documentElement
	root.style.setProperty("--global-lit", interfaceLit.toString()) // update :root CSS variable
	if (firstrun) interfaceLitDefault = interfaceLit // set default color for reset
}

function updateFontHue(firstrun = false) { // change font and outline hue
	// update hue from slider if element exists
	if (document.getElementById("fontHueSlider") !== null) fontHue = document.getElementById("fontHueSlider").value
	var root = document.documentElement
	root.style.setProperty("--font-hue", fontHue.toString()) // update :root CSS variable
	if (firstrun) fontHueDefault = fontHue // set default color for reset
}
function updateFontSat(firstrun = false) { // change font and outline saturation
	// update saturation from slider if element exists
	if (document.getElementById("fontSatSlider") !== null) fontSat = document.getElementById("fontSatSlider").value
	var root = document.documentElement
	root.style.setProperty("--font-sat", fontSat.toString()) // update :root CSS variable
	if (firstrun) fontSatDefault = fontSat // set default color for reset
}
function updateFontLit(firstrun = false) { // change font and outline lightness
	// update lightness from slider if element exists
	if (document.getElementById("fontLitSlider") !== null) fontLit = document.getElementById("fontLitSlider").value
	var root = document.documentElement
	root.style.setProperty("--font-lit", fontLit.toString()) // update :root CSS variable
	if (firstrun) fontLitDefault = fontLit // set default color for reset
}

function updateCoderainHue(firstrun = false) { // change coderain hue
	// update hue from slider if element exists
	if (document.getElementById("coderainHueSlider") !== null) coderainHue = document.getElementById("coderainHueSlider").value
	if (firstrun) coderainHueDefault = coderainHue // set default color for reset
}
function updateCoderainSat(firstrun = false) { // change coderain saturation
	// update saturation from slider if element exists
	if (document.getElementById("coderainSatSlider") !== null) coderainSat = document.getElementById("coderainSatSlider").value
	if (firstrun) coderainSatDefault = coderainSat // set default color for reset
}
function updateCoderainLit(firstrun = false) { // change coderain lightness
	// update lightness from slider if element exists
	if (document.getElementById("coderainLitSlider") !== null) coderainLit = document.getElementById("coderainLitSlider").value
	if (firstrun) coderainLitDefault = coderainLit // set default color for reset
}

function updColorMenuLayout() {
	toggleColorControlsMenu(true) // flag to update layout
}

function initColorArrays() { // store original cipher colors and current modifier values
	origColors = []
	chkboxColors = []
	globColors = []
	var tmp = {}
	for (i = 0; i < cipherList.length; i++) {
		tmp = {H:cipherList[i].H, S:cipherList[i].S, L:cipherList[i].L}
		origColors.push(tmp)
		tmp = {H:0, S:0, L:0}
		chkboxColors.push(tmp) // individual controls
	}
	globColors = {H:0, S:0, L:0}
}

function resetColorControls() { // set all color controls to zero
	if (document.getElementById("globalSliderHue") !== null) document.getElementById("globalSliderHue").value = 0
	if (document.getElementById("globalSliderSaturation") !== null) document.getElementById("globalSliderSaturation").value = 0
	if (document.getElementById("globalSliderLightness") !== null) document.getElementById("globalSliderLightness").value = 0
	globColors = {H:0, S:0, L:0} // reset global color modifier

	// reset values for individual colors
	chkboxColors = []
	var tmp_H, tmp_S, tmp_L
	for (i = 0; i < cipherList.length; i++) {
		chkboxColors.push({H:0, S:0, L:0}) // create new object for each cipher
		tmp_H = document.getElementById("sliderHue"+i)
		tmp_S = document.getElementById("sliderSaturation"+i)
		tmp_L = document.getElementById("sliderLightness"+i)
		if (tmp_H !== null && tmp_S !== null && tmp_L !== null) { // if individual sliders are visible
			tmp_H.value = 0
			tmp_S.value = 0
			tmp_L.value = 0
		}
	}

	// update colors
	changeCipherColors(0, "Hue")
	changeCipherColors(0, "Saturation")
	changeCipherColors(0, "Lightness")

	interfaceHue = interfaceHueDefault // reset interface color
	interfaceSat = interfaceSatDefault
	interfaceLit = interfaceLitDefault
	if (document.getElementById("interfaceHueSlider") !== null) document.getElementById("interfaceHueSlider").value = interfaceHue
	if (document.getElementById("interfaceSatSlider") !== null) document.getElementById("interfaceSatSlider").value = interfaceSat
	if (document.getElementById("interfaceLitSlider") !== null) document.getElementById("interfaceLitSlider").value = interfaceLit

	fontHue = fontHueDefault // reset font and outline color
	fontSat = fontSatDefault
	fontLit = fontLitDefault
	if (document.getElementById("fontHueSlider") !== null) document.getElementById("fontHueSlider").value = fontHue
	if (document.getElementById("fontSatSlider") !== null) document.getElementById("fontSatSlider").value = fontSat
	if (document.getElementById("fontLitSlider") !== null) document.getElementById("fontLitSlider").value = fontLit
	updateInterfaceColor()

	updateTables() // update
}

function changeCipherColors(elem_id, col_mode, cipher_index) {
	var ciph_len, st_pos, cur_ciphColBox

	var curVal
	if (typeof elem_id == "number") {
		curVal = elem_id // if a number was passed instead of element id
	} else {
		curVal = Number(document.getElementById(elem_id).value) // current slider value
	}

	if (cipher_index == undefined) { // no cipher_index, change all colors
		ciph_len = cipherList.length
		st_pos = 0
	} else { // else change individual color
		ciph_len = cipher_index+1
		st_pos = cipher_index
	}
	for (i = st_pos; i < ciph_len; i++) {
		if (col_mode == "Hue") {
			if (cipher_index == undefined) { globColors.H = curVal } // update global value modified
			else { chkboxColors[i].H = curVal } // update individual cipher value
			cipherList[i].H = colFmt(origColors[i].H + chkboxColors[i].H + globColors.H,"H")
		} else if (col_mode == "Saturation") {
			if (cipher_index == undefined) { globColors.S = curVal }
			else { chkboxColors[i].S = curVal }
			cipherList[i].S = colFmt(origColors[i].S + chkboxColors[i].S + globColors.S,"S")
		} else if (col_mode == "Lightness") {
			if (cipher_index == undefined) { globColors.L = curVal }
			else { chkboxColors[i].L = curVal }
			cipherList[i].L = colFmt(origColors[i].L + chkboxColors[i].L + globColors.L,"L")
		}
		cur_ciphColBox = document.getElementById("cipherHSL"+i) // textbox with HSLA values for current color
		if (cur_ciphColBox !== null) cur_ciphColBox.value = colPad(cipherList[i].H)+colPad(cipherList[i].S)+colPad(cipherList[i].L,true)
	}
	updateTables(false) // update without redrawing color controls
	updateWordBreakdown() // update word/cipher breakdown table
}

function colFmt(val, mode) { // normalize HSLA color values
	if (mode == "H") {
		if (val < 0) { val = val % 360 + 360 } // fix 0-360 range
		else { val = val % 360 }
	} else if (mode == "S") {
		val = clampNum(val, 0, 100)
	} else if (mode == "L") {
		val = clampNum(val, 0, 100)
	}
	return val
}

function clampNum(number, min, max) { // clamp number within specified range
	return Math.max(min, Math.min(number, max))
}

function colPad(val, last = false) { // padding for color values (monospace)
	val = String(val+"    ").substring(0,4)
	if (last) val = val.substring(0,val.length-1) // last value has no extra space
	return val
}

function populateColorValues() { // update color controls for each individual cipher
	var tmp_H, tmp_S, tmp_L, tmp_HSL
	for (i = 0; i < cipherList.length; i++) {
		tmp_H = document.getElementById("sliderHue"+i)
		tmp_S = document.getElementById("sliderSaturation"+i)
		tmp_L = document.getElementById("sliderLightness"+i)
		tmp_HSL = document.getElementById("cipherHSL"+i)
		if (tmp_H !== null) tmp_H.value = chkboxColors[i].H
		if (tmp_S !== null) tmp_S.value = chkboxColors[i].S
		if (tmp_L !== null) tmp_L.value = chkboxColors[i].L
		if (tmp_HSL !== null) tmp_HSL.value = colPad(cipherList[i].H)+colPad(cipherList[i].S)+colPad(cipherList[i].L,true)
	}
}

// ====================== Enabled Cipher Table ======================

function saveInitialCiphers() {
	if (cipherListSaved.length == 0) cipherListSaved = [...cipherList] // make a copy of initial ciphers to revert changes
}

function initCiphers(updDefCiph = true) { // list categories, define default (base) ciphers
	var c = ""
	cCat = [] // clear categories
	for (i = 0; i < cipherList.length; i++) {
		c = cipherList[i].cipherCategory
		if (cCat.indexOf(c) == -1) {
			if ( c !== "Extra" || (c == "Extra" && optShowExtraCiphers) ) cCat.push(c) // list categories (exclude Extra if not allowed)
		}
		if (cipherList[i].enabled && updDefCiph) defaultCipherArray.push(cipherList[i].cipherName) // update default ciphers
	}
	if (defaultCipherArraySaved.length == 0) defaultCipherArraySaved = [...defaultCipherArray] // copy of initial default ciphers
	initColorArrays()
}

function enableDefaultCiphers() {
	var ciphArr = defaultCipherArray
	for (n = 0; n < cipherList.length; n++) {
		cur_chkbox = document.getElementById("cipher_chkbox"+n)
		if (ciphArr.indexOf(cipherList[n].cipherName) == -1) { // disable non-default ciphers
			cipherList[n].enabled = false // disable cipher
			if (cur_chkbox !== null) cur_chkbox.checked = false // update checkbox if present
		} else if (!cipherList[n].enabled) { // enable default cipher (if previously not active)
			cipherList[n].enabled = true // enable cipher
			if (cur_chkbox !== null) cur_chkbox.checked = true // update checkbox if present
		}
	}
	updateTables() // update
}

function enableAllCiphers() {
	prevCiphIndex = -1 // reset cipher selection
	var cur_chkbox
	for (i = 0; i < cipherList.length; i++) {
		if ( cipherList[i].cipherCategory !== "Extra" || (cipherList[i].cipherCategory == "Extra" && optShowExtraCiphers) ) { // if category is not Extra or is Extra ciphers allowed
			cur_chkbox = document.getElementById("cipher_chkbox"+i)
			cipherList[i].enabled = true
			if (cur_chkbox !== null) cur_chkbox.checked = true
		}
	}
	updateTables() // update
}

function enableAllEnglishCiphers() {
	prevCiphIndex = -1 // reset cipher selection
	var cur_chkbox
	for (i = 0; i < cipherList.length; i++) {
		if (cipherList[i].cipherCategory == "Extra" && optShowExtraCiphers && cipherList[i].cArr.indexOf(97) > -1) { // lowercase "a", "Extra" English ciphers only if allowed
			cur_chkbox = document.getElementById("cipher_chkbox"+i)
			cipherList[i].enabled = true
			if (cur_chkbox !== null) cur_chkbox.checked = true
		} else if (cipherList[i].cipherCategory !== "Extra" && cipherList[i].cArr.indexOf(97) > -1) { // lowercase "a", other cipher categories
			cur_chkbox = document.getElementById("cipher_chkbox"+i)
			cipherList[i].enabled = true
			if (cur_chkbox !== null) cur_chkbox.checked = true
		}
	}
	updateTables() // update
}

function disableAllCiphers() {
	prevCiphIndex = -1 // reset cipher selection
	var cur_chkbox
	for (i = 0; i < cipherList.length; i++) {
		cur_chkbox = document.getElementById("cipher_chkbox"+i)
		cipherList[i].enabled = false // if checkbox exists toggle state (next line)
		if (cur_chkbox !== null) cur_chkbox.checked = false
	}
	updateTables() // update
}

function toggleCipherCategory(ciph_cat) {
	prevCiphIndex = -1 // reset cipher selection
	var on_first = false
	for (i = 0; i < cipherList.length; i++) {
		if (cipherList[i].cipherCategory == ciph_cat && !cipherList[i].enabled) on_first = true // if one cipher is disabled
	}
	var cur_chkbox
	for (i = 0; i < cipherList.length; i++) {
		//console.log(cipherList[i].cipherCategory)
		if (cipherList[i].cipherCategory == ciph_cat) {
			cur_chkbox = document.getElementById("cipher_chkbox"+i)
			if (on_first) { // if one cipher is disabled, first enable all
				cipherList[i].enabled = true
				if (cur_chkbox !== null) cur_chkbox.checked = true
			} else { // if all ciphers are enabled, disable all
				cipherList[i].enabled = false
				if (cur_chkbox !== null) cur_chkbox.checked = false
			}
		}
	}
	updateTables() // update
}

function toggleCipher(c_id, chk = false) {
	prevCiphIndex = -1 // reset cipher selection
	cipherList[c_id].enabled = !cipherList[c_id].enabled // toggle true/false
	if (chk) { // toggle checkbox state
		cur_chkbox = document.getElementById("cipher_chkbox"+c_id);
		if (cur_chkbox !== null) cur_chkbox.checked = !cur_chkbox.checked; // update checkbox if visible
	}
	updateTables() // update
}

function updateTables(updColorLayout = true) {
	prevCiphIndex = -1 // reset cipher selection
	for (i = 0; i < cipherList.length; i++) {
		// if previous breakdown cipher is not enabled or if cipher no longer exists
		if ( cipherList[i].cipherName == breakCipher && !cipherList[i].enabled || typeof cipherList.find(o => o.cipherName == breakCipher) == 'undefined' ) {
			for (n = 0; n < cipherList.length; n++) {
				if (cipherList[n].enabled) {
					breakCipher = cipherList[n].cipherName // load first enabled cipher instead
					break
				}
			}
		}
	}
	if (colorControlsMenuOpened && updColorLayout) updColorMenuLayout() // update color controls if menu is opened
	if (encodingMenuOpened) toggleEncodingMenu(true) // update encoding menu
	updateEnabledCipherTable() // update enabled cipher table
	autoHistoryTableLayout() // use Compact History if necessary
	updateHistoryTable() // update history table
	updateWordBreakdown(breakCipher, true) // update word breakdown and choose first enabled cipher
}

function autoHistoryTableLayout() { // use Compact History
	if (enabledCiphCount > optCompactCiphCount) { compactHistoryTable = true } else { compactHistoryTable = false }
}

function updateEnabledCipherCount() {
	enabledCiphCount = 0 // number of enabled ciphers
	for (i = 0; i < cipherList.length; i++) { // count all enabled ciphers
		if (cipherList[i].enabled) enabledCiphCount++
	}
}

function sVal() {
	return document.getElementById("phraseBox").value.trim() // get value, remove spaces from both sides
}

function sValNoComments() {
	// get value, remove text inside [...], remove [ and ] (unfinished input), remove spaces from both sides
	return document.getElementById("phraseBox").value.replace(/\[.+\]/g, '').replace(/\[/g, '').replace(/\]/g, '').trim()
}

// 100% font size
// var chWidthArr = [["a",8.13],["b",9.28],["c",7.66],["d",9.28],["e",8.32],["f",4.8],["g",9.38],["h",9.26],["i",3.79],["j",3.86],["k",8.38],["l",3.79],["m",14.38],["n",9.26],["o",8.64],["p",9.28],["q",9.28],["r",5.48],["s",6.81],["t",5.46],["u",9.21],["v",7.49],["w",12.12],["x",7.51],["y",7.49],["z",7.09],["A",10.13],["B",10.3],["C",9.63],["D",11.23],["E",9.11],["F",8.64],["G",10.5],["H",11.04],["I",4.22],["J",6.98],["K",9.78],["L",8.08],["M",12.99],["N",11.04],["O",11.42],["P",9.68],["Q",11.42],["R",9.89],["S",8.45],["T",8.12],["U",10.76],["V",9.68],["W",15.31],["X",8.9],["Y",8.76],["Z",8.94],["1",5.03],["2",7.81],["3",7.71],["4",9.1],["5",7.74],["6",8.39],["7",8.13],["8",8.76],["9",8.39],["0",9.07],["-",5.25],["(",4.58],[")",4.6],[" ",3.66]]
// 95% font size
var chWidthArr = [["a",7.72],["b",8.82],["c",7.27],["d",8.82],["e",7.9],["f",4.57],["g",8.92],["h",8.8],["i",3.6],["j",3.67],["k",7.95],["l",3.6],["m",13.65],["n",8.8],["o",8.2],["p",8.82],["q",8.82],["r",5.2],["s",6.47],["t",5.19],["u",8.75],["v",7.12],["w",11.52],["x",7.13],["y",7.12],["z",6.73],["A",9.62],["B",9.78],["C",9.15],["D",10.67],["E",8.65],["F",8.2],["G",9.97],["H",10.48],["I",4],["J",6.63],["K",9.28],["L",7.67],["M",12.33],["N",10.48],["O",10.85],["P",9.2],["Q",10.85],["R",9.38],["S",8.02],["T",7.72],["U",10.22],["V",9.2],["W",14.55],["X",8.45],["Y",8.32],["Z",8.48],["1",4.78],["2",7.42],["3",7.32],["4",8.63],["5",7.35],["6",7.97],["7",7.72],["8",8.32],["9",7.97],["0",8.62],["-",4.98],["(",4.35],[")",4.37],[" ",3.66]]
function calcCipherNameWidthPx(str) { // calculate column width inside table based on cipher name length
	var i, n, m
	var tmp = 0; var curChar = ''; var lenArr = [];
	var arr = str.split(' ') // split string by words
	for (i = 0; i < arr.length; i++) { // for each word
		tmp = 0 // reset word width
		for (n = 0; n < arr[i].length; n++) { // for each character in that word
			curChar = arr[i].substring(n,n+1) // current character
			for (m = 0; m < chWidthArr.length; m++) { // for each element in array with widths
				if (chWidthArr[m][0] == curChar) tmp += chWidthArr[m][1] // add width for correspondent character
			}
		}
		lenArr.push(tmp) // save width for current word
	}
	tmp = 0
	for (i = 0; i < lenArr.length; i++) {
		if (lenArr[i] > tmp) tmp = lenArr[i] // find max value
	}
	if (tmp+6 >= 74) return Math.ceil(tmp+6) // 6px padding, 80px for 100% font
	return 74
}

function calcCipherNameHeightPx(str) { // calculate row height inside compact table based on cipher name length
	var i, n
	var tmp = 0; var curChar = '';
	for (i = 0; i < str.length; i++) { // for each character in string
		curChar = str.substring(i,i+1) // current character
		for (n = 0; n < chWidthArr.length; n++) { // for each element in array with widths
			if (chWidthArr[n][0] == curChar) tmp += chWidthArr[n][1] // add width for correspondent character
		}
	}
	return Math.ceil(tmp+18) // 20px padding for 100% font
}

function updateEnabledCipherTable() { // draws a table with phrase gematria for enabled ciphers (odd/even)
	document.getElementById("enabledCiphTable").innerHTML = "" // clear previous table
	
	prevCiphIndex = -1 // reset cipher selection
	updateEnabledCipherCount() // get number of enabled ciphers

	if (enabledCiphCount == 0) return // do not draw the table
	
	phr = sVal() // grab current phrase
	// if (enabledCiphCount == 0 || phr == "") return // no enabled ciphers, empty phraseBox
	
	var result_columns = enabledCiphColumns
	if (enabledCiphCount <= enabledCiphColumns) { result_columns = enabledCiphCount }
	// else if (enabledCiphCount > 6 && enabledCiphCount <= 20) { result_columns = 2 }
	// else { result_columns = 4 }

	var cur_ciph_index = 0 // index of current of enabled cipher that will be added to the table (total # of ciphers added so far + 1)
	var new_row_opened = false // condition to open new row inside table
	var odd_col = true // odd = "cipher name - value", even = "value - cipher name", used in each row
	//var n_of_rows = 0 // number of rows inside cipher table
	var last_row_elements = 0 // number of ciphers in the last row
	var ciph_in_row = 0 // count active ciphers in row
	var cur_col = "" // current cipher color
	
	var o = '<table class="phraseGemContainer"><tbody>'
	
	//n_of_rows = Math.ceil(cipherList.length / result_columns) // 6.0 => 6 rows, 6.25 => 7 rows
	last_row_elements = enabledCiphCount % result_columns
	
	for (i = 0; i < cipherList.length; i++) { // <= to include last row
		if (cipherList[i].enabled) { // for active ciphers
			cur_ciph_index++
			if (!new_row_opened) { // check if new row has to be opened
				o += '<tr>'
				odd_col = true // reset on each new row
				new_row_opened = true
			}
			if (ciph_in_row < result_columns) { // until number of ciphers in row equals number of colums
				cur_col = (optColoredCiphers) ? 'color: hsl('+cipherList[i].H+' '+cipherList[i].S+'% '+cipherList[i].L+'% / 1);' : ''
				if (odd_col) { // odd column, "cipher name - value"
					o += '<td class="phraseGemCiphName" style="'+cur_col+'">'+cipherList[i].cipherName+'</td>'
					// o += '<td class="phraseGemValueOdd" style="'+cur_col+'">'+cipherList[i].calcGematria(phr)+'</td>'
					o += '<td class="phraseGemValueOdd" style="'+cur_col+'"><span class="numProp">'+cipherList[i].calcGematria(phr)+'<span></td>'
					ciph_in_row++
					odd_col = false
					//console.log(cipherList[i].cipherName+": odd")
				} else if (!odd_col) { // even column, "value - cipher name"
					// o += '<td class="phraseGemValueEven" style="'+cur_col+'">'+cipherList[i].calcGematria(phr)+'</td>'
					o += '<td class="phraseGemValueEven" style="'+cur_col+'"><span class="numProp">'+cipherList[i].calcGematria(phr)+'<span></td>'
					o += '<td class="phraseGemCiphName" style="'+cur_col+'">'+cipherList[i].cipherName+'</td>'
					ciph_in_row++
					odd_col = true
					//console.log(cipherList[i].cipherName+": even")
				}
				if (cur_ciph_index == enabledCiphCount && last_row_elements !== 0) { // last enabled cipher is added and last row is not fully populated
					for (n = 0; n < result_columns - last_row_elements; n++) { // for remaining empty cells in last row
						if (odd_col) {
							o += '<td class="phraseGemCiphNameBlank"></td>'
							o += '<td class="phraseGemValueOdd"></td>'
							odd_col = false
						} else if (!odd_col) {
							o += '<td class="phraseGemValueEven"></td>'
							o += '<td class="phraseGemCiphNameBlank"></td>'
							odd_col = true
						}
					}
				}
				if (ciph_in_row == result_columns) { // check if row needs to be closed
					o += '</tr>'
					ciph_in_row = 0 // reset cipher count
					new_row_opened = false
				}
			}
		}
	}
	o += '</tbody></table>'
	
	document.getElementById("enabledCiphTable").innerHTML += o
}

// =================== Phrase Box - History Table ===================

function phraseBoxKeypress(e) { // run on each keystroke inside text box - onkeydown="navHistory(event.keyCode) - from index.html
	var phrPos, pBox
	phr = sVal() // get phrase from SearchField
	pBox = document.getElementById("phraseBox")

	phrPos = sHistory.indexOf(phr) // position of phrase in History array
	switch (e) { // keypress event
		case 13: // Enter
			if (!optNewPhrasesGoFirst) { addPhraseToHistory(phr, true) } // enter as single phrase
			else { addPhraseToHistoryUnshift (phr, true) } // insert in the beginning
			pBox.value = "" // clear textbox on Enter
			break
		case 38: // Up Arrow
			if (sHistory.length > 0) {
				if (phrPos > 0) {phr = sHistory[phrPos - 1]} // load previous phrase
				else if (phrPos <= 0) {phr = sHistory[sHistory.length-1]} // back to last phrase
				pBox.value = phr; updateWordBreakdown(); updateEnabledCipherTable()
			}
			break
		case 40: // Down Arrow
			if (sHistory.length > 0) {
				if (phrPos < sHistory.length-1 && phrPos > -1) {phr = sHistory[phrPos + 1]} // load next phrase
				else if (phrPos == -1 || phrPos == sHistory.length-1) {phr = sHistory[0]} // back to the first phrase
				pBox.value = phr; updateWordBreakdown(); updateEnabledCipherTable()
			}
			break
		case 46: // Delete - remove entries from history
			if (sHistory.length == 1 && phrPos > -1) { // if one entry and matches box contents
				sHistory = [] // reinit
				tArea = document.getElementById("HistoryTableArea")
				tArea.innerHTML = "" // clear table
			}
			if (phrPos > -1) {
				sHistory.splice(phrPos, 1) // if a match is found, delete entry
			}
			pBox.value = "" // empty text box, so the old value is not added again
			updateWordBreakdown() // update breakdown
			updateTables() // update enabled cipher and history table
			break
		case 36: // Home - clear all history
			sHistory = [] // reinitialize
			document.getElementById("HistoryTableArea").innerHTML = "" // clear history table
			break
		case 35: // End - parse sentence as separate words and phrases
			phr = phr.replace(/\t/g, " ") // replace tab with spaces
			phr = phr.replace(/ +/g, " ") // remove double spaces
			// phr = phr.replace(/(\.|,|:|;|\\|)/g, "") // remove special characters, last one is "|"

			wordArr = phr.split(" ") // split string to array, space delimiter
			phrLimit = optPhraseLimit // max phrase length
			var phrase = ""; var k = 1;

			// for (i = 0; i < wordArr.length; i++) { // phrases in normal order
			// 	k = 1 // word count
			// 	phrase = wordArr[i]
			// 	addPhraseToHistory(phrase, false)
			// 	while (k < phrLimit && i+k < wordArr.length) { // add words to a phrase, check it is within array size
			// 		phrase += " "+wordArr[i+k]
			// 		addPhraseToHistory(phrase, false)
			// 		k++
			// 	}
			// }

			var tArr = []; var phrasePos; // temporary history array
			for (i = wordArr.length-1; i > -1; i--) { // add phrases in reverse order, so you don't have to read backwards
				k = 1 // word count
				phrase = wordArr[i]
				if (isNaN(phrase)) { // add first word if not a number
					phrasePos = tArr.indexOf(phrase);
					if (phrasePos > -1) tArr.splice(phrasePos, 1) // remove existing phrase
					tArr.unshift(phrase) // add new phrase in the beginning (since building is in reverse order)
				}
				while (k < phrLimit && i-k > -1) { // add words to a phrase, check it is within wordArr size
					phrase = wordArr[i-k]+" "+phrase
					if (isNaN(phrase)) {
						phrasePos = tArr.indexOf(phrase);
						if (phrasePos > -1) tArr.splice(phrasePos, 1) // remove existing phrase
						tArr.unshift(phrase) // add new phrase in the beginning (since building is in reverse order)
					}
					k++
				}
			}
			for (i = 0; i < tArr.length; i++) sHistory.push(tArr[i]) // add phrases to history table
			updateHistoryTable() // update table only once after all phrases are added
			break
	}
}

function addPhraseToHistory(phr, upd) { // add new phrase to search history
	var phrPos
	if (phr !== "" && isNaN(phr)) { // if input is not empty and not a number
		phrPos = sHistory.indexOf(phr);
		if (phrPos > -1) { // if phrase is in history
			sHistory.splice(phrPos, 1) // first remove it from array
		}
		sHistory.push(phr) // insert it in the end
	}
	if (upd) updateHistoryTable() // table update condition
}

function addPhraseToHistoryUnshift(phr, upd) { // add new phrase to the beginning
	var phrPos
	if (phr !== "" && isNaN(phr)) { // if input is not empty and not a number
		phrPos = sHistory.indexOf(phr);
		if (phrPos > -1) { // if phrase is in history
			sHistory.splice(phrPos, 1) // first remove it from array
		}
		sHistory.unshift(phr) // insert it in the beginning
	}
	if (upd) updateHistoryTable() // table update condition
}

function updateHistoryTable(hltBoolArr) {
	var ms, i, x, y, z, curCiph, curCiphCol, gemVal
	var ciphCount = 0 // count enabled ciphers (for hltBoolArr)
	histTable = document.getElementById("HistoryTableArea")
	
	if (sHistory.length == 0) { return }

	prevPhrID = -1 // reset phrase selection
	ms = '<table class="HistoryTable"><tbody>'

	highlt = document.getElementById("highlightBox").value.replace(/ +/g," ") // get value of Highlight textbox, remove double spaces
	
	var hltMode = false // highlighting mode
	if (highlt !== "") {
		highlt_num = highlt.split(" "); // create array, space delimited numbers
		highlt_num = highlt_num.map(function (e) { return parseInt(e, 10); }) // parse string array as integer array to exclude quotes
		highlt_num = removeZeroHlt(highlt_num)
		hltMode = true
	}

	var dispPhrase = "" // phrase to display inside history table
	var tmpComment = ""; var commentMatch;
	for (x = 0; x < sHistory.length; x++) {

		if (x % 25 == 0 && enabledCiphCount !== 0) { // show header after each 25 phrases
			ms += '<tr class="cH"><td class="mP"></td>'
			for (z = 0; z < cipherList.length; z++) {
				if (cipherList[z].enabled) {
					curCiphCol = (optColoredCiphers) ? 'color: hsl('+cipherList[z].H+' '+cipherList[z].S+'% '+cipherList[z].L+'% / 1);' : ''
					if (compactHistoryTable) {
						ms += '<td class="hCV" style="height: '+calcCipherNameHeightPx(cipherList[z].cipherName)+'px;"><span class="hCV2" style="'+curCiphCol+'">'+cipherList[z].cipherName+'</span></td>' // color of cipher displayed in the table
					} else {
						ms += '<td class="hC" style="'+curCiphCol+' max-width: '+calcCipherNameWidthPx(cipherList[z].cipherName)+'px; min-width: '+calcCipherNameWidthPx(cipherList[z].cipherName)+'px;">'+cipherList[z].cipherName+'</td>' // color of cipher displayed in the table
					}
				}
			}
			ms += "</tr>"
		}

		ciphCount = 0 // reset enabled cipher count (for hltBoolArr)

		if (optAllowPhraseComments) {
			tmpComment = "" // reset
			commentMatch = sHistory[x].match(/\[.+\]/g) // find comment
			if (commentMatch !== null) {
				tmpComment = commentMatch[0]
			}
			// comment first, phrase without comment and leading/trailing spaces
			dispPhrase = '<span class="pCHT">'+tmpComment+'</span>' + sHistory[x].replace(/\[.+\]/g, '').trim()
		} else {
			dispPhrase = sHistory[x]
		}
		ms += '<tr><td class="hP" data-ind="'+x+'">' + dispPhrase + '</td>' // hP - history phrase, add data index
		var col = "" // value color

		for (y = 0; y < cipherList.length; y++) {
			if (cipherList[y].enabled) {
				curCiph = cipherList[y]
				gemVal = curCiph.calcGematria(sHistory[x]) // value only
				
				//phrase x, cipher y
				col = (optColoredCiphers) ? 'hsl('+curCiph.H+' '+curCiph.S+'% '+curCiph.L+'% / 1)' : '' // default value color

				// if highlight mode is on
				if (hltMode) {
					// if cross cipher match and highlight box doesn't include number
					if ( optFiltCrossCipherMatch && !highlt_num.includes(gemVal) ) {
						col = (optColoredCiphers) ? 'hsl('+curCiph.H+' '+curCiph.S+'% '+curCiph.L+'% / '+alphaHlt+')' : 'hsl(0 0% 70% / '+alphaHlt+')'
					// hltBoolArr was passed and value inside hltBoolArr is not active (optFiltSameCipherMatch)
					} else if ( typeof hltBoolArr !== 'undefined' && hltBoolArr[x][ciphCount] == false ) {
						col = (optColoredCiphers) ? 'hsl('+curCiph.H+' '+curCiph.S+'% '+curCiph.L+'% / '+alphaHlt+')' : 'hsl(0 0% 70% / '+alphaHlt+')'
					}
				}
				ciphCount++ // next position in hltBoolArr
				ms += '<td class="tC"><span style="color: '+col+'" class="gV"> '+gemVal+' </span></td>'
			}
		}
		ms += '</tr>'
	}

	ms += '</tbody></table>'
	histTable.innerHTML = ms
}