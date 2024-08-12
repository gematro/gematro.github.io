// ======================== Quickstart Guide ========================

function closePanel(el) {
	$('#darkOverlay').remove();
	$(el).remove();
	$('body').removeClass('noScroll') // restore scrolling
}

function gematroVersionFull() {
	var v = gematroVersion.split('.')
	var m = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
	return `${m[v[1]]} ${v[2]}, 20${v[0]}`
}

function displayQuickstartGuide() {
	$('<div id="darkOverlay" onclick="closePanel(&quot;.quickGuide&quot;)"></div>').appendTo('body'); // overlay

	var o = '<div class="quickGuide">'
	o += '<p><span class="qgBold2">Quickstart Guide</span><br><span class="qgVer">GEMATRO '+gematroVersion+' ('+gematroVersionFull()+')</span></p>'

	o += '<hr class="numPropSeparator">'
	
	o += '<p class="qgMedium">Phrase Box - enter any word, phrase or number</p>\n<ul><li><span class="qgBold">"Enter"</span> - add phrase to history table</li><li><span class="qgBold">"Up"</span> and <span class="qgBold">"Down"</span> arrow keys - select phrase from history table<br>Press <span class="qgBold">"Down"</span> to select previously entered phrase</li><li><span class="qgBold">"Delete"</span> - delete current phrase from history table</li><li>Additional Shortcuts:<br><span class="qgBold">"Home"</span> - clear history table<br><span class="qgBold">"End"</span> - shortcut for <span class="qgBold">"Enter As Words"</span> function</li></ul>'

	o += '<p class="qgMedium">Highlight Box - enter space delimited numbers</p>\n<ul><li><span class="qgBold">"Enter"</span> - activate filter (remove nonmatching phrases and ciphers)</li><li><span class="qgBold">"Delete"</span> - clear box contents (does not reset filter)<br><span class="qgNote">Note: Reset filter with an "X" button near the box</span></li><li>Additional Shortcuts:<br><span class="qgBold">"Insert"</span> - find all available matches<br><span class="qgBold">"Ctrl + Delete"</span> - reset filter and revert to initial history state<br><span class="qgNote">Note: Type "0 0" or "Ctrl + Left Click" on "0" cell twice to highlight zero<br>History table is recalculated on each keystroke</span></li></ul>'

	o += '<p class="qgMedium">Enabled Ciphers Table</p>\n<ul><li><span class="qgBold">"Left Click"</span> on cipher name - choose cipher, display detailed word breakdown</li><li><span class="qgBold">"Right Click"</span> on cipher name - disable cipher</li><li><span class="qgBold">"Ctrl + Right Click"</span> on cipher name - reorder ciphers, select the same cipher to cancel</li><li><span class="qgBold">"Left Click"</span> on number - show number properties</li><li><span class="qgBold">"Right Click"</span> on number - show additional number properties</li></ul>'

	o += '<p class="qgMedium">Number Properties</p>\n<ul><li><span class="qgBold">"Ctrl"</span> key pressed, mouse over number - show number properties</li><li><span class="qgBold">"Shift"</span> key pressed, mouse over number - show additional number properties</li><li>All properties are supported only for values up to 100,000</li><li>Drag cursor across the tooltip to close it or simply click outside<br><span class="qgNote">Note: Number Properties are available inside Enabled Ciphers Table, History Table and Query Table</span></li></ul>'

	o += '<p class="qgMedium">Cipher/Breakdown Chart</p>\n<ul><li><span class="qgBold">Cipher Chart</span> can be used as a virtual keyboard</li><li><span class="qgBold">"Left Click"</span> on top left corner for <span class="qgBold">Space</span>, top right corner for <span class="qgBold">Backspace</span></li><li><span class="qgBold">"Left Click"</span> on Cipher Name to switch to uppercase letters</li><li><span class="qgBold">"Left Click"</span> on letters to type</li><li><span class="qgBold">"Left Click"</span> on numbers/letters to highlight cells (<span class="qgBold">Breakdown Chart</span>)</li></ul>'

	o += '<p class="qgMedium">History Table</p><ul><li><span class="qgBold">"Right Click"</span> on phrase - open <span class="qgBold">Context Menu</span> to edit existing entries</li><li><span class="qgBold">"Left Click"</span> on value - toggle blinking effect (temporary)</li><li><span class="qgBold">"Right Click"</span> on value - toggle cell visibility (temporary)</li><li><span class="qgBold">"Shift + Left Click"</span> on cipher name - disable cipher</li><li><span class="qgBold">"Shift + Left Click"</span> on phrase - delete phrase from history</li><li><span class="qgBold">"Ctrl + Left Click"</span> on phrase - load phrase into <span class="qgBold">Phrase Box</span></li><li><span class="qgBold">"Ctrl + Right Click"</span> on phrase - reorder phrases, select the same phrase to cancel</li><li><span class="qgBold">"Ctrl + Left Click"</span> on value (cell) - toggle highlighting for number<br>Highlighter always recalculates table, temporary effects are removed<br><span class="qgNote">Note: Click on cell, not on the number itself, otherwise you will open number properties</span></li></ul>'

	o += '<hr class="numPropSeparator">'
	o += '<p><span class="qgBold2">Options</p>'

	o += '<ul><li><span class="qgBold">"Number Calculation"</span><ul><li>Full (123 = 123) - <span class="qgBold">default</span></li><li>Reduced (123 = 1+2+3 = 6)</li><li>Off</li></ul></li>'

	o += '<li><span class="qgBold">"Matrix Code Rain"</span> - use dynamic background</li>'

	o += '<li><span class="qgBold">Highlighter</span> has two different modes:<ul><li><span class="qgBold">"Cross Cipher Match"</span></li><li><span class="qgBold">"Same Cipher Match"</span><br><span class="qgNote">Note: If there is just one value, only "Cross Cipher Match" will pick that</span></li></ul></li>'

	o += '<li><span class="qgBold">"Show Only Matching"</span> - when highlighter is active, sets opacity of nonmatching values to zero</li>'

	o += '<li><span class="qgBold">"Dotless Latin ı as i"</span> - when enabled, dotless lowercase Latin letter <span class="qgBold">ı</span> uses the same value as regular lowercase Latin letter <span class="qgBold">i</span> for gematria calculation<br><span class="qgNote">Note: This letter is used in the Latin-script alphabets of Azerbaijani, Crimean Tatar, Gagauz, Kazakh, Tatar and Turkish</span></li>'
	o += '<li><span class="qgBold">"Ignore Comments [...]"</span> - exclude any text inside square brackets from gematria calculation<br><span class="qgNote">Note: Comments are preserved on export/import</span></li>'
	o += '<li><span class="qgBold">"Live Database Mode"</span> - disable this option to generate a precalculated database on file import<br><span class="qgNote">Note: More information is available in the "Databases" section of this guide</span></li>'
	
	o += '<li><span class="qgBold">"New Phrases Go First"</span> - new phrases are inserted at the beginning of <span class="qgBold">History Table</span></li>'
	
	o += '<li><span class="qgBold">"Phrases on DB page"</span> - specify the amount of phrases on one page of <span class="qgBold">Database</span> query results</span></li>'
	o += '<li><span class="qgBold">"Scroll DB by lines"</span> - set scrolling speed inside <span class="qgBold">Database</span> query results</span></li>'

	o += '<li><span class="qgBold">"Letter/Word Count"</span> - show number of recognized (by current cipher) letters and words</li>'
	o += '<li><span class="qgBold">"Word Breakdown"</span> - show detailed breakdown for current phrase</li>'
	o += '<li><span class="qgBold">"Compact Breakdown"</span> - do not show full phrase (plain text) inside breakdown table</li>'
	o += '<li><span class="qgBold">"Cipher Chart"</span> - show a table of correspondences between letters and values for current cipher</li>'

	o += '<li><span class="qgBold">"Gradient Charts"</span> - toggle fill style for <span class="qgBold">"Word Breakdown"</span> and <span class="qgBold">"Cipher Chart"</span></li>'

	o += '<li><span class="qgBold">"Switch Ciphers (CSV)"</span> - enable previously selected ciphers on history file import</li></ul>'

	o += '<hr class="numPropSeparator">'
	o += '<p><span class="qgBold2">Features</p>'

	o += '<p class="qgMedium">Gematria Calculation</p>\n<ul><li><span class="qgBold">Standard (default)</span> - each character is substituted with a corresponding value and values for all characters in phrase are simply added together<br><span class="qgNote">\'Full\' and \'Reduced\' Number Calculation modes are available only for \'Standard\' mode<br></span></li><li><span class="qgBold">Multiplication</span> - each character value is multiplied by its position in a phrase (based on Mispar Ha&#39;achor)</li><li><span class="qgBold">Reversed Multiplication</span> - each character value is multiplied by its position in a phrase counting from the last character (based on Mispar Bone&#39;eh)<br><span class="qgNote">More information on these methods - <a class="qgNote" target="_blank" href="https://torahcalc.com/info/gematria/">https://torahcalc.com/info/gematria/</a></span></li></ul>'

	o += '<p class="qgMedium">Date Calculator</p>\n<ul><li>Calculate interval between two dates according to Gregorian calendar, supports <span class="qgBold">Add/Subtract</span> mode<br><span class="qgNote">Note: Make sure to consult timeanddate.com or other websites for precise calculations for old dates or other calendars (e.g. Julian)</span></li><li><span class="qgBold">Left Click</span> on <span class="qgBold">"From"</span> or <span class="qgBold">"to"</span> label to set a custom date description</li><li><span class="qgBold">Left Click</span> to highlight line with date durations</li><li><span class="qgBold">Right Click</span> to remove line with date durations</li><span class="qgNote">Note: Toggle "Include End Date" checkbox to bring the removed lines back</span></li><li>You can <span class="qgBold">import</span> a text file to calculate durations between multiple dates at once.<br>One date per line, <span class="qgBold">M/D/YYYY</span> format, comments are optional:<br><br>GEMATRO_DATES<br>1/28/2006 [comment]<br>11/7/1968 [comment]</li></ul>'

	o += '<p class="qgMedium">Color Controls</p>\n<ul><li>Change interface, font or cipher colors (<span class="qgBold">HSL</span> - Hue, Saturation, Lightness)</li><li>Make sure to <span class="qgBold">"Save Settings"</span> or <span class="qgBold">"Export Settings (JS)"</span> before you make any modifications inside <span class="qgBold">"Edit Ciphers"</span> menu</li></ul>'

	o += '<p class="qgMedium">Edit Ciphers</p>\n<ul><li><span class="qgBold">"Left Click"</span> on cipher name in <span class="qgBold">Enabled Ciphers Table</span> to edit existing cipher or to create a new cipher based on existing one</li><li>Cipher names are unique; if current cipher name matches an existing cipher, that very cipher is edited</li><li>Existing cipher can be moved to a different or new category by updating it with a different category name (it will be added as the last item in that category)<br><span class="qgNote">Ciphers can be rearranged with \'Ctrl + Right Click\' inside \'Enabled Ciphers Table\'<br>Otherwise, you can manually edit exported \'ciphers.js\' file</span></li><li>Any new cipher category can be created; empty categories with no ciphers are removed automatically</li><li>Cells with individual letters or values can be modified<li><span class="qgBold">"Color Controls"</span> are reset on any change in <span class="qgBold">"Edit Ciphers"</span> menu, make sure you do not have any unsaved changes</li><li><span class="qgBold">All Unicode</span> characters are supported, including emoji<br><span class="qgNote">Emoji with U+200D Zero Width Joiner, U+FE0F Variation Selector or Fitzpatrick skin tones are split into base components</span></li><li><span class="qgBold">Wheel Cipher</span> mode supports letters instead of values<br><span class="qgNote">\'a\' = \'b\', \'b\' = \'c\', \'c\' = \'d\'<br>\'abc\' = a(b) + b(c) + c(d) = \'bcd\'<br>\'Multiply\', \'Rev. Mult.\' and \'Number Calculation\' are disabled</span></li><li><span class="qgBold">Multi Character</span> cipher keys are supported, the longest syllable is always calculated first<br><span class="qgNote">Example: \'a\' = 100, \'ab\' = 10, \'abc\' = 1<br>\'abcaba\' = abc(1) + ab(10) + a(100) = 111<br>Can be combined with Case Sensitive and Wheel Cipher modes<br>\'Multiply\', \'Rev. Mult.\' and \'Number Calculation\' are disabled</span></li></ul>'

	o += '<p class="qgMedium">Encoding</p>\n<ul><p>Encoder supports <span class="qgBold">3 different modes</span>, all of which can work with Normal or Multiplicative <span class="qgBold">Gematria Calculation</span> modes. <span class="qgBold">Wheel Ciphers</span> are not supported.<br>Positive values are supported; use <span class="qgBold">-0</span> as a matching value for zero.<br>Read section about <span class="qgBold">Databases</span> for additional information and <span class="qgBold">Query Table</span> tips.\n</p>\n<ul><li><span class="qgBold">Syllables (default)</span> - syllables generated from <span class="qgBold">"Alphabet"</span> and <span class="qgBold">"Vowels"</span> fields (excluding letters from <span class="qgBold">"Exclude"</span> field) are used to create a matching phrase. You can type <span class="qgBold">start;end</span> or <span class="qgBold">start;</span> or <span class="qgBold">;end</span> inside <span class="qgBold">Phrase Box</span> to construct a complex phrase<br><span class="qgNote">Note: Anagrams are available for Normal gematria calculation mode only. Use "Odd letters" option to switch between even/odd phrase length</span></li><li><span class="qgBold">Database (1 phrase)</span> - uses a single phrase from currently loaded <span class="qgBold">Live Database</span>. You can use <span class="qgBold">start;end</span> constructor (and its variations) in the <span class="qgBold">Phrase Box</span><br><span class="qgNote">Note: Make sure that gematria value of current (additional) text in the Phrase Box is less than matching value, otherwise no results will be found</span></li><li><span class="qgBold">Database (2 phrases)</span> - uses two phrases from currently loaded <span class="qgBold">Live Database</span>. You can use <span class="qgBold">start;middle;end</span> constructor (and its variations, e.g. <span class="qgBold">;;end</span>) in the <span class="qgBold">Phrase Box</span><br><span class="qgNote">Note: This mode is very computationally expensive and can be really slow on some devices (Firefox can be ~7x slower compared to Chrome, try different browsers). It is not recommended to use a database with more than 20,000 entries (n^2 combinations). If this mode is used with Multiplicative gematria calculation mode, it becomes even slower. Encoding (2 phrases) for ciphers with negative values is the slowest mode, it can take minutes, so use a smaller database or one phrase mode</span></li></ul></ul>'

	o += '<p><span class="qgBold">"Find Matches"</span> - populate <span class="qgBold">Highlight Box</span> with numbers that match at least twice inside <span class="qgBold">History Table</span><br><span class="qgNote">Note: Cipher filter is not applied, you can press "Enter" inside Highlight Box to show matching ciphers only</span></p>'
	o += '<p><span class="qgBold">"Enter As Words"</span> - read text from <span class="qgBold">Phrase Box</span> one word at a time until a certain phrase length is reached, then move on to the next starting word, process is repeated until all words are entered into <span class="qgBold">History Table</span><br><span class="qgNote">Note: Change "Word limit" value to specify maximum phrase length</span></p>'
	o += '<p><span class="qgBold">"Clear History"</span> - remove all entries from <span class="qgBold">History Table</span></p>'

	o += '<hr class="numPropSeparator">'
	o += '<p><span class="qgBold2">Export</p>'

	o += '<ul><li><span class="qgBold">"Print Cipher Chart", etc</span> - render corresponding element as an image (PNG), image preview is opened first<br><span class="qgNote">Note: If text or table are misaligned, click "Refresh" button to generate a new image</span></li>'

	o += '<li><span class="qgBold">"Import File"</span> - import a <span class="qgBold">.txt</span> file (one phrase per line), previously exported CSV history, exported matches or user ciphers<br><span class="qgNote">Note: You can also drag and drop file into Phrase Box</span></li>'

	o += '<li><span class="qgBold">"Create Database (TXT)"</span> - convert a <span class="qgBold">.txt</span> file into <span class="qgBold">Live Database</span> format<br><span class="qgNote">Note: Database contains unique words which are sorted by alphabetical order</span></li>'

	o += '<li><span class="qgBold">"Export History (CSV)"</span> - export phrases from current history table as a CSV file, semicolon is used as separator, first row contains cipher names</li>'

	o += '<li><span class="qgBold">"Export Matches (TXT)"</span> - export all available matches from current history table as a text file, current highlighter mode (<span class="qgBold">"Cross Cipher Match"</span> or <span class="qgBold">"Same Cipher Match"</span>) is used during export<br><span class="qgNote">Note: Matches can be imported back into calculator</span></li>'

	o += '<li><span class="qgBold">"Save/Load/Reset"</span> - save, load or reset current calculator and ciphers settings for this browser (localStorage)<br><span class="qgNote">Note: Use "Reset" twice to clear all localStorage. Saved settings do not persist if you clear cache, use Incognito mode or a different browser on the same device</span></li>'

	o += '<li><span class="qgBold">"Export Settings (JS)"</span> - export current calculator settings and ciphers as a separate file. Ciphers active at the moment of export become the new default ones<br><span class="qgNote">Note: You can edit file manually with a text editor, make sure to keep formatting<br>Any changes made to options or menu settings are saved as well<br>If you want to permanently change settings, you can download an offline version of the calculator from GitHub repository and replace "ciphers.js" file inside "calc" directory<br>Online and offline versions are identical</span></li></ul>'

	o += '<hr class="numPropSeparator">'
	o += '<p><span class="qgBold2">Databases</p>'

	o += '<ul><li>Import a properly formatted TXT file to activate database query mode. <span class="qgBold">Live Database Mode</span> is used by default, however <span class="qgBold">GEMATRO</span> can generate a precalculated database as well<br><span class="qgNote">Note: File should contain one phrase per line, the first line must be<br>CREATE_GEMATRO_DB</span></li>'

	o += '<li><span class="qgBold">"Ignore Comments [...]"</span> flag affects database generation<br><span class="qgNote">Note: When database is loaded, calculator should use the same mode of "Ignore Comments [...]" as at the moment of database generation, otherwise values inside database and calculator will differ. The same is valid for number calculation settings</span></li>'

	o += '<li>Precalculated (CSV) database can be generated when <span class="qgBold">"Live Database Mode"</span> is disabled. Database will have values only for currently selected ciphers. Those ciphers (and calculator options) are stored inside the database as well (at the end of file).<br><span class="qgNote">Note: When precalculated database is loaded, calculator will allow to use only those ciphers which are available inside that database<br>For example, if you load a database that contains values only for English Ordinal cipher, English Ordinal becomes the only available cipher for any calculations until you unload the database. "Live Database Mode" calculates all values on the fly and can work with any ciphers, however this mode is slower and there is no separate file with precalculated gematria values</span></li>'

	o += '<li>After you import a properly formatted text file for database generation, calculation will start immediately and a dialogue that offers to save new precalculated database will appear<br><span class="qgNote">Note: Process may take some time, please be patient</span></li>'

	o += '<li>When a database is imported, new elements become available:<ul><li><span class="qgBold">"Query"</span> - match current phrase or number against database</li><li><span class="qgBold">"Clear DB Query" (Features)</span> - close current <span class="qgBold">Query Table</span> and switch back to centered interface</li><li><span class="qgBold">"Unload Database" (Features)</span> - unload database and restore initial ciphers; <span class="qgBold">History Table</span> is preserved</li><li><span class="qgBold">"Export DB Query (CSV)" (Export)</span> - save matching phrases from database as a CSV file</li></ul>'

	o += '<li><span class="qgBold">"Cipher Edit"</span> (and rearrangement) is not available when a precalculated database is loaded</li>'

	o += '<li>Current highlighter mode (<span class="qgBold">"Cross Cipher Match"</span> or <span class="qgBold">"Same Cipher Match"</span>) controls database query<br><span class="qgNote">Note: "Show Only Matching" option hides nonmatching values as well</span></li>'

	o += '<li>Query is based on current cipher selection; there is no limit for the amount of enabled ciphers</li>'

	o += '<li>Input any phrase into the <span class="qgBold">"Phrase Box"</span> and press <span class="qgBold">"Query"</span> button to match against currently loaded database</li><li>Numerical input is supported, several numbers are recognized as well:<br><span class="qgBold">74 0 142</span><br><span class="qgNote">Note: In the example above, the first enabled cipher will be matched against 74 and the third cipher will be matched against 142</span></li></ul>'

	o += '<p class="qgMedium">Query Table</p>\n'

	o += '<ul><li>Use <span class="qgBold">Search Bar</span> to filter results<ul><li><span class="qgBold">"Enter"</span> - apply filter<br><span class="qgNote">Note: If box is empty, filter is cleared</span></li><li><span class="qgBold">"Delete"</span> - clear filter</li></ul><span class="qgNote">Note: Search is case sensitive, regular expressions are supported</span>'

	o += '<li>Use <span class="qgBold">"Up"</span> and <span class="qgBold">"Down"</span> arrow keys to scroll one page at a time or use the mouse wheel<br><span class="qgNote">Note: Up/Down arrow keys work only when input is focused inside textbox with current index</span></li><li>A horizontal scroll bar above the table can be used for navigation as well or you can input the exact position inside the box with index</li>'

	o += '<li>Drag the bottom-right corner of the <span class="qgBold">Query Table</span> to resize it<br><span class="qgNote">Hint: Extend the table in case if long phrases do not fit on one line</span></li>'

	o += '<li><span class="qgBold">"Right Click"</span> on phrase - open <span class="qgBold">Context Menu</span> with additional options</li><li><span class="qgBold">"Ctrl + Left Click"</span> on phrase - load phrase from <span class="qgBold">Query Table</span> into <span class="qgBold">Phrase Box</span> and add it to <span class="qgBold">History Table</span></li>'

	o += '<li><span class="qgBold">"Left Click"</span> on button in the top right corner to temporarily minimize the table if it obstructs the interface (left click again to bring the table back)<br><span class="qgNote">Hint: You can zoom the page out if too many ciphers are active</span></ul>'

	o += '</div>'

	$(o).appendTo('body'); // guide
	$('body').addClass('noScroll') // prevent scrolling
}

function displayCipherInfoPanel(id) {
	$('<div id="darkOverlay" onclick="closePanel(&quot;.ciphInfoPanel&quot;)"></div>').appendTo('body'); // overlay

	var o = '<div class="ciphInfoPanel">'

	o += '<p><span class="qgBold2">'+cipherList[id].cipherName+'</span></p>'

	o += '<div>'
	o += '<hr class="numPropSeparator">'
	
	o += '<div style="margin-top: 2em; margin-bottom: 2em; text-align: left;">'
	o += '<span>'+cipherList[id].cipherDescription+'</span>'
	o += '</div>'

	o += '<hr class="numPropSeparator">'
	o += '</div>'

	o += '<p><span class="qgNote" style="font-style:normal;">\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ &#9737; /////////////////////////////////</span></p>'

	o += '</div>'

	$(o).appendTo('body'); // guide
	$('body').addClass('noScroll') // prevent scrolling
}