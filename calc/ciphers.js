// ciphers.js

/*
new cipher(
	"English Ordinal", // cipher name
	"English", // category
	120, 57, 36, // hue, saturation, lightness
	[97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122], // lowercase characters
	[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26], // values
	true, // characters with diacritic marks have the same value as regular ones, default is "true"
	true, // enabled state, default is "false"
	false, // case sensitive cipher, default is "false"
	false, // multi character/syllable cipher, default is "false"
	false, // wheel cipher, default is "false"
	"Simple cipher based on alphabetical order." // brief description
)
*/

cipherList = [
	new cipher(
		"English Ordinal",
		"English",
		120, 65, 62,
		[97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122],
		[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26],
		true,
		true,
		false,
		false,
		false,
		"<p> Simple cipher based on <span class='qgBold'>alphabetical order</span>. </p> <p> It is a base cipher from which other ciphers such as <span class='qgBold'>Reverse</span>, <span class='qgBold'>Reduced</span> and <span class='qgBold'>Standard</span> are derived. </p>"
	),
	new cipher(
		"Reverse Ordinal",
		"English",
		150, 74, 50,
		[97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122],
		[26,25,24,23,22,21,20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1],
		true,
		true,
		false,
		false,
		false,
		"<p> This cipher is derived from <span class='qgBold'>English Ordinal</span>. It uses <span class='qgBold'>reverse order</span> of the alphabet. </p> <p> The sum of values of both <span class='qgBold'>English Ordinal</span> and <span class='qgBold'>Reverse Ordinal</span> is always <span class='qgBold'>27 * Letter Count</span> for any phrase. </p>"
	),
	new cipher(
		"English Reduced",
		"English",
		216, 95, 73,
		[97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122],
		[1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8],
		true,
		true,
		false,
		false,
		false,
		"<p> This cipher is based on <span class='qgBold'>English Ordinal</span> where every value is <span class='qgBold'>reduced to a single digit</span>. </p> <p> It is related to <span class='qgBold'>Numerology</span> which focuses on numbers from <span class='qgBold'>1 to 9</span> (there are no zeroes). </p> <p> In order to <span class='qgBold'>reduce</span> any value to a single digit, a number is broken into individual digits and these single digits are added together, so that a new number is obtained. This procedure is done iteratively for newly obtained numbers until a single digit value is calculated. </p> <p> Example:<br><span class='qgBold'>S</span> = 19 -> 1+9 = 10 -> 1+0 = <span class='qgBold'>1</span><br> </p> <p> <span class='qgNote'>Read more: <a class='qgLink' target='_blank' href='https://archive.org/details/TheSecretTeachingsOfAllAgesManlyHall/page/n203/mode/2up'><span class='qgBold'>The Secret Teachings Of All Ages</span> by <span class='qgBold'>Manly Palmer Hall</span>, p. 204</a></span> </p>"
	),
	new cipher(
		"Reverse Reduced",
		"English",
		180, 60, 69,
		[97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122],
		[8,7,6,5,4,3,2,1,9,8,7,6,5,4,3,2,1,9,8,7,6,5,4,3,2,1],
		true,
		true,
		false,
		false,
		false,
		"<p> This cipher is based on <span class='qgBold'>Reverse Ordinal</span> where every value is <span class='qgBold'>reduced</span> to a single digit as in <span class='qgBold'>English Reduced</span>. </p> <p> The sum of values of both <span class='qgBold'>English Reduced</span> and <span class='qgBold'>Reverse Reduced</span> is always <span class='qgBold'>9 * Letter Count + additional 9 for each 'I' or 'R'</span> for any phrase. </p> <p> Moreover, values of <span class='qgBold'>English Ordinal, Reverse Ordinal, English Reduced, Reverse Reduced</span> combined add up to <span class='qgBold'>36 * Letter Count + additional 9 for each 'I' or 'R'</span> for any phrase. </p> <p> <span class='qgBold'>Numerology</span> (single digit value) of the combined value of <span class='qgBold'>Ordinal</span> and <span class='qgBold'>Reverse</span> or all four is always <span class='qgBold'>9</span>. </p>"
	),
	new cipher(
		"English Standard",
		"English",
		50, 68, 63,
		[97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122],
		[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400,500,600,700,800],
		true,
		false,
		false,
		false,
		false,
		"<p> This cipher is based on <span class='qgBold'>English Reduced</span> where each value is multiplied by <span class='qgBold'>10<sup>n-1</sup></span> for every <span class='qgBold'>1 to 9 loop count</span>, where <span class='qgBold'>n</span> is the current loop count. </p> <p> In simple words, the values are multiplied by <span class='qgBold'>1</span> for the <span class='qgBold'>first 1 to 9 loop</span>, by <span class='qgBold'>10</span> for the <span class='qgBold'>second loop</span>, by <span class='qgBold'>100</span> for the <span class='qgBold'>third loop</span> and so on. </p> <p> <span class='qgBold'>Reverse</span> variaton of this cipher is <span class='qgBold'>experimental</span>. </p> <p> <span class='qgNote'>Formula to calculate values: <a class='qgLink' target='_blank' href='https://en.wikipedia.org/wiki/Gematria#Standard_encoding'>Wikipedia - Gematria (Standard encoding)</a></span> </p>"
	),
	new cipher(
		"Agrippa Key",
		"English",
		256, 85, 76,
		[97,98,99,100,101,102,103,104,105,107,108,109,110,111,112,113,114,115,116,117,120,121,122,106,118,10680,119],
		[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400,500,600,700,800,900],
		true,
		false,
		false,
		false,
		false,
		"<p> This cipher can be found in the <span class='qgBold'>Three Books of Occult Philosophy</span> (Book II, Chapter XX) by <span class='qgBold'>Heinrich Cornelius Agrippa</span>. </p> <p> It is based on <span class='qgBold'>23</span> letters of <span class='qgBold'>Latin</span> alphabet with four additional letters of <span class='qgBold'>J</span>, <span class='qgBold'>V</span>, <span class='qgBold'>Hi</span> (not assigned) and <span class='qgBold'>Hu</span> (<span class='qgBold'>W</span> is used instead). </p> <p> Additional letters were used as separate sounds to expand the alphabet to <span class='qgBold'>27</span> letters in order to have <span class='qgBold'>three parts</span> each representing the digits from <span class='qgBold'>1 to 9</span>. </p> <p> <span class='qgNote'>Read more: <a class='qgLink' target='_blank' href='https://en.wikipedia.org/wiki/Gematria#English'>Wikipedia - Gematria (English)</a></span> </p>"
	),
	new cipher(
		"Elizabethan Simple",
		"Baconian",
		120, 65, 62,
		[97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122],
		[1,2,3,4,5,6,7,8,9,9,10,11,12,13,14,15,16,17,18,19,20,20,21,22,23,24],
		true,
		false,
		false,
		false,
		false,
		"<p> This cipher is based on <span class='qgBold'>Old English</span> alphabet (<span class='qgBold'>Elizabethan</span>) which contains <span class='qgBold'>24</span> letters as opposed to the <span class='qgBold'>26</span> letters used in the <span class='qgBold'>Modern English</span> alphabet. </p> <p> Letters <span class='qgBold'>I</span> and <span class='qgBold'>J</span> are used <span class='qgBold'>interchangeably</span>, same as <span class='qgBold'>U</span> and <span class='qgBold'>V</span>. </p> <p> <span class='qgNote'>Read more: <a class='qgLink' target='_blank' href='https://archive.org/details/TheSecretTeachingsOfAllAgesManlyHall/page/n571/mode/2up'><span class='qgBold'>The Secret Teachings Of All Ages</span> by <span class='qgBold'>Manly Palmer Hall, p. 572</span></a></span> </p>"
	),
	new cipher(
		"Elizabethan Reverse",
		"Baconian",
		150, 74, 50,
		[97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122],
		[24,23,22,21,20,19,18,17,16,16,15,14,13,12,11,10,9,8,7,6,5,5,4,3,2,1],
		true,
		false,
		false,
		false,
		false,
		"<p> This cipher is based on <span class='qgBold'>Elizabethan Simple</span>. It uses <span class='qgBold'>reverse order</span> of the <span class='qgBold'>Old English</span> alphabet. </p>"
	),
	new cipher(
		"Elizabethan Short",
		"Baconian",
		180, 60, 69,
		[97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122],
		[1,2,3,4,5,6,7,8,9,9,1,2,3,4,5,6,7,8,9,1,2,2,3,4,5,6],
		true,
		false,
		false,
		false,
		false,
		"<p> This cipher is based on <span class='qgBold'>Elizabethan Simple</span>, all values are <span class='qgBold'>reduced to a single digit</span>. </p>"
	),
	new cipher(
		"Elizabethan R Short",
		"Baconian",
		207, 77, 64,
		[97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122],
		[6,5,4,3,2,1,9,8,7,7,6,5,4,3,2,1,9,8,7,6,5,5,4,3,2,1],
		true,
		false,
		false,
		false,
		false,
		"<p> This cipher is based on <span class='qgBold'>Elizabethan Reverse</span> where every value is <span class='qgBold'>reduced</span> to a single digit as in <span class='qgBold'>Elizabethan Short</span>. </p>"
	),
	new cipher(
		"Kay Cipher",
		"Baconian",
		0, 55, 66,
		[97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,38,128624],
		[27,28,29,30,31,32,33,34,35,35,10,11,12,13,14,15,16,17,18,19,20,20,21,22,23,24,25,26],
		true,
		false,
		false,
		false,
		false,
		"<p> This cipher is based on <span class='qgBold'>Old English</span> alphabet, however the sequence starts with letter <span class='qgBold'>K = 10</span> (first double digit value) and it is continued incrementally until all letters of the alphabet are obtained. </p> <p> The letter <span class='qgBold'>Z = 24</span> is followed by English ampersand (<span class='qgBold'>& = 25</span>) and Latin ampersand (<span class='qgBold'>et = 26</span>) before the sequence wraps around to continue with the letter <span class='qgBold'>A = 27</span> until the last letter <span class='qgBold'>J</span> is assigned the value of <span class='qgBold'>35</span>. </p> <p> <span class='qgNote'>Read more: <a class='qgLink' target='_blank' href='https://www.fbrt.org.uk/wp-content/uploads/2020/06/The_Fra_Rosie_Cross_Cipher_287.pdf'>Peter Dawkins - The Fra. Rosie Cross Cipher</a></span> </p>"
	),
	new cipher(
		"Jay Cipher",
		"Baconian",
		352, 56, 78,
		[97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122],
		[27,28,29,30,31,32,33,34,35,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26],
		true,
		false,
		false,
		false,
		false,
		"<p> This cipher is based on <span class='qgBold'>26 letter English</span> alphabet. It is similar to <span class='qgBold'>Kay Cipher</span>. </p> <p> Sequence starts with the letter <span class='qgBold'>J = 10</span> (first double digit value) and it is continued incrementally until all letters of the alphabet are obtained. </p> <p> In this cipher the letter <span class='qgBold'>Z = 26</span> is not followed by ampersands, so the sequence wraps around and continues with the letter <span class='qgBold'>A = 27</span> until the last letter <span class='qgBold'>I</span> is assigned the value of <span class='qgBold'>35</span>. </p>"
	),
	new cipher(
		"Case Sensitive",
		"Baconian",
		190, 50, 60,
		[97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90],
		[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52],
		true,
		false,
		true,
		false,
		false,
		"<p> This cipher uses <span class='qgBold'>lower and upper case</span> letters in <span class='qgBold'>sequential order</span>. </p> <p> It is an <span class='qgBold'>experimental</span> cipher, for the use of different variants of upper case letters (e.g. <span class='qgBold'>N</span> and <span class='qgBold'>Ɲ</span>) is documented only within the context of <span class='qgBold'>Bacon's biliteral cipher</span>. </p> <p> <span class='qgNote'>Read more: <a class='qgLink' target='_blank' href='https://archive.org/details/TheSecretTeachingsOfAllAgesManlyHall/page/n555/mode/2up'><span class='qgBold'>The Secret Teachings Of All Ages</span> by <span class='qgBold'>Manly Palmer Hall, p. 556</span></a></span> </p>"
	),
	new cipher(
		"Alt Case Sensitive",
		"Baconian",
		127, 36, 62,
		[65,97,66,98,67,99,68,100,69,101,70,102,71,103,72,104,73,105,74,106,75,107,76,108,77,109,78,110,79,111,80,112,81,113,82,114,83,115,84,116,85,117,86,118,87,119,88,120,89,121,90,122],
		[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52],
		true,
		false,
		true,
		false,
		false,
		"<p> This cipher uses <span class='qgBold'>upper and lower case</span> letters in <span class='qgBold'>alternating order</span>. </p> <p> It is an <span class='qgBold'>experimental</span> cipher, for the use of different variants of upper case letters (e.g. <span class='qgBold'>N</span> and <span class='qgBold'>Ɲ</span>) is documented only within the context of <span class='qgBold'>Bacon's biliteral cipher</span>. </p>"
	),
	new cipher(
		"English Qaballa",
		"Other",
		20, 68, 64,
		[97,108,119,104,115,100,111,122,107,118,103,114,99,110,121,106,117,102,113,98,109,120,105,116,101,112],
		[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26],
		true,
		false,
		false,
		false,
		false,
		"<p> <span class='qgNote'>Source: <a class='qgLink' target='_blank' href='https://en.wikipedia.org/wiki/English_Qaballa'>Wikipedia - English Qabbala</a></span> </p> <p> <span class='qgBold'>English Qaballa</span> is a system of <span class='qgBold'>Hermetic Qabalah</span>, supported by a system of arithmancy that interprets the letters of the <span class='qgBold'>English</span> alphabet via an assigned set of values, discovered by <span class='qgBold'>James Lees</span> in <span class='qgBold'>1976</span>. </p> <p> It is the result of an intent to understand, interpret, and elaborate on the mysteries of <span class='qgBold'>Aleister Crowley's</span> received text, <span class='qgBold'>Liber AL vel Legis</span>, the Book of the Law. </p> <p> According to <span class='qgBold'>Jake Stratton-Kent</span>: </p> <blockquote> 'the <span class='qgBold'>English Qaballa</span> is a qabalah and not a system of numerology. A qabalah <span class='qgBold'>is specifically related to</span> three factors: one, a <span class='qgBold'>language</span>; two, a <span class='qgBold'>'holy' text</span> or texts; three, <span class='qgBold'>mathematical laws</span> at work in these two.' </blockquote>"
	),
	new cipher(
		"Illuminati Novice",
		"Other",
		47, 66, 65,
		[97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122],
		["12.","11.","10.","9.","8.","7.","6.","5.","4.","4.","3.","2.","1.","13.","14.","15.","16.","17.","18.","19.","20.","20.","21.","22.","23.","24."],
		true,
		false,
		false,
		false,
		true,
		"<p> This <span class='qgBold'>substitution cipher</span> was used in the <span class='qgBold'>Illuminati Novice</span> degree of the <span class='qgBold'>Bavarian Illuminati</span>. </p> <p> Its use for the calculation of <span class='qgBold'>gematria</span> values is <span class='qgBold'>experimental</span> and undocumented. <p> <span class='qgNote'>Recommended reading: <a class='qgLink' target='_blank' href='https://www.lewismasonic.co.uk/esoteric/the-secret-school-of-wisdom-paperback-the-authentic-rituals-and-doctrines-of-the.htm'>The Secret School of Wisdom - The Authentic Rituals and Doctrines of the Illuminati (Lewis Masonic, 2015)</a></span> </p>"
	),
	new cipher(
		"Mispar Siduri",
		"Hebrew",
		33, 81, 58,
		[1488,1489,1490,1491,1492,1493,1494,1495,1496,1497,1499,1500,1502,1504,1505,1506,1508,1510,1511,1512,1513,1514,1498,1501,1503,1507,1509],
		[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,11,13,14,17,18],
		true,
		false,
		false,
		false,
		false,
		"<p> Simple <span class='qgBold'>Hebrew</span> cipher based on <span class='qgBold'>alphabetical order</span>. </p> <p> <span class='qgBold'>Siduri</span> originates from the word <span class='qgBold'>Seder</span> meaning <span class='qgBold'>order</span>. </p> <p> <span class='qgBold'>Sofit</span> (final form) letters have <span class='qgBold'>the same values</span> as initial letter forms. </p>"
	),
	new cipher(
		"Mispar Katan",
		"Hebrew",
		45, 65, 53,
		[1488,1489,1490,1491,1492,1493,1494,1495,1496,1497,1499,1500,1502,1504,1505,1506,1508,1510,1511,1512,1513,1514,1498,1501,1503,1507,1509],
		[1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8,9,1,2,3,4,2,4,5,8,9],
		true,
		false,
		false,
		false,
		false,
		"<p> This <span class='qgBold'>Hebrew</span> cipher is based on <span class='qgBold'>Mispar Siduri</span>, all values are <span class='qgBold'>reduced to a single digit</span>. </p> <p> <span class='qgBold'>Katan</span> means <span class='qgBold'>small</span>. </p> <p> <span class='qgBold'>Sofit</span> (final form) letters have <span class='qgBold'>the same values</span> as initial letter forms. </p>"
	),
	new cipher(
		"Mispar Hechrachi",
		"Hebrew",
		50, 78, 63,
		[1488,1489,1490,1491,1492,1493,1494,1495,1496,1497,1499,1500,1502,1504,1505,1506,1508,1510,1511,1512,1513,1514,1498,1501,1503,1507,1509],
		[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400,20,40,50,80,90],
		true,
		false,
		false,
		false,
		false,
		"<p> This <span class='qgBold'>Hebrew</span> cipher uses <span class='qgBold'>Standard</span> values (also known as <span class='qgBold'>Absolute</span> or <span class='qgBold'>Normative</span>). </p> <p> <span class='qgBold'>Sofit</span> (final form) letters have <span class='qgBold'>the same values</span> as initial letter forms. </p> <p> <span class='qgNote'>Read more: <a class='qgLink' target='_blank' href='https://en.wikipedia.org/wiki/Gematria#Standard_encoding'>Wikipedia - Gematria (Standard encoding)</a></span> </p>"
	),
	new cipher(
		"Greek Ordinal",
		"Greek",
		154, 70, 67,
		[945,946,947,948,949,989,987,950,951,952,953,954,955,956,957,958,959,960,985,961,963,962,964,965,966,967,968,969,993],
		[1,2,3,4,5,6,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,20,21,22,23,24,25,26,27],
		true,
		false,
		false,
		false,
		false,
		"<p> Simple <span class='qgBold'>Greek</span> cipher based on <span class='qgBold'>alphabetical order</span>. </p>"
	),
	new cipher(
		"Greek Reduced",
		"Greek",
		141, 53, 80,
		[945,946,947,948,949,989,987,950,951,952,953,954,955,956,957,958,959,960,985,961,963,962,964,965,966,967,968,969,993],
		[1,2,3,4,5,6,6,7,8,9,1,2,3,4,5,6,7,8,9,1,2,2,3,4,5,6,7,8,9],
		true,
		false,
		false,
		false,
		false,
		"<p> This <span class='qgBold'>Greek</span> cipher is based on <span class='qgBold'>Greek Ordinal</span>, all values are <span class='qgBold'>reduced to a single digit</span>.. </p>"
	),
	new cipher(
		"Greek Isopsephy",
		"Greek",
		191, 80, 71,
		[945,946,947,948,949,989,987,950,951,952,953,954,955,956,957,958,959,960,985,961,963,962,964,965,966,967,968,969,993],
		[1,2,3,4,5,6,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,200,300,400,500,600,700,800,900],
		true,
		false,
		false,
		false,
		false,
		"<p> This <span class='qgBold'>Greek</span> cipher uses <span class='qgBold'>Standard</span> values. </p> <p> <span class='qgNote'>Read more: <a class='qgLink' target='_blank' href='https://en.wikipedia.org/wiki/Isopsephy'>Wikipedia - Isopsephy</a></span> </p>"
	),
	new cipher(
		"Abjad Numerals",
		"Arabic",
		25, 64, 59,
		[1575,1576,1580,1583,1607,1608,1586,1581,1591,1610,1603,1604,1605,1606,1587,1593,1601,1589,1602,1585,1588,1578,1579,1582,1584,1590,1592,1594],
		[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400,500,600,700,800,900,1000],
		true,
		false,
		false,
		false,
		false,
		"<p> <span class='qgBold'>Abjad Numerals</span> represent an alphanumeric code where decimal numerical values are assigned to the <span class='qgBold'>28</span> letters of the <span class='qgBold'>Arabic</span> alphabet. </p> <p> <span class='qgNote'>Read more: <a class='qgLink' target='_blank' href='https://en.wikipedia.org/wiki/Abjad_numerals'>Wikipedia - Abjad numerals</a></span> </p>"
	),
	new cipher(
		"Russian Ordinal",
		"Russian",
		120, 65, 62,
		[1072,1073,1074,1075,1076,1077,1105,1078,1079,1080,1081,1082,1083,1084,1085,1086,1087,1088,1089,1090,1091,1092,1093,1094,1095,1096,1097,1098,1099,1100,1101,1102,1103],
		[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33],
		false,
		false,
		false,
		false,
		false,
		"<p> Simple <span class='qgBold'>Russian</span> cipher based on <span class='qgBold'>alphabetical order</span>. </p> <p> It is a base cipher from which other ciphers such as <span class='qgBold'>Reverse</span>, <span class='qgBold'>Reduced</span> and <span class='qgBold'>Standard</span> are derived. </p>"
	),
	new cipher(
		"Russian R Ordinal",
		"Russian",
		150, 74, 50,
		[1072,1073,1074,1075,1076,1077,1105,1078,1079,1080,1081,1082,1083,1084,1085,1086,1087,1088,1089,1090,1091,1092,1093,1094,1095,1096,1097,1098,1099,1100,1101,1102,1103],
		[33,32,31,30,29,28,27,26,25,24,23,22,21,20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1],
		false,
		false,
		false,
		false,
		false,
		"<p> This <span class='qgBold'>Russian</span> cipher is derived from <span class='qgBold'>Russian Ordinal</span>. It uses <span class='qgBold'>reverse order</span> of the alphabet. </p>"
	),
	new cipher(
		"Russian Reduced",
		"Russian",
		216, 95, 73,
		[1072,1073,1074,1075,1076,1077,1105,1078,1079,1080,1081,1082,1083,1084,1085,1086,1087,1088,1089,1090,1091,1092,1093,1094,1095,1096,1097,1098,1099,1100,1101,1102,1103],
		[1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8,9,1,2,3,4,5,6],
		false,
		false,
		false,
		false,
		false,
		"<p> This <span class='qgBold'>Russian</span> cipher is based on <span class='qgBold'>Russian Ordinal</span>, all values are <span class='qgBold'>reduced to a single digit</span>. </p>"
	),
	new cipher(
		"Russian R Reduced",
		"Russian",
		180, 60, 69,
		[1072,1073,1074,1075,1076,1077,1105,1078,1079,1080,1081,1082,1083,1084,1085,1086,1087,1088,1089,1090,1091,1092,1093,1094,1095,1096,1097,1098,1099,1100,1101,1102,1103],
		[6,5,4,3,2,1,9,8,7,6,5,4,3,2,1,9,8,7,6,5,4,3,2,1,9,8,7,6,5,4,3,2,1],
		false,
		false,
		false,
		false,
		false,
		"<p> This <span class='qgBold'>Russian</span> cipher is based on <span class='qgBold'>Russian R Ordinal</span> where every value is <span class='qgBold'>reduced</span> to a single digit as in <span class='qgBold'>Russian Reduced</span>. </p>"
	)
]