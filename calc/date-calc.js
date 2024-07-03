// ======================== Date Calculator =========================

function updDates(offsetMode = false, ctrlClass = '') { // offsetMode - add/subtract

	// date 1
	var d1 = new Date($('#d1y').val(), $('#d1m').val()-1, $('#d1d').val()) // year, month, date
	saved_d1 = new Date(d1) // save date
	if (ctrlClass !== 'dateInputYear') $('#d1y').val(d1.getFullYear()) // update controls with valid values
	$('#d1m').val(d1.getMonth()+1)
	$('#d1d').val(d1.getDate())
	$('#d1full').text(monthNames(d1.getMonth())+' '+d1.getDate()+', '+d1.getFullYear()) // update date 1

	// date 2
	var d2
	if (!offsetMode) { // date was set by date 2 controls
		d2 = new Date($('#d2y').val(), $('#d2m').val()-1, $('#d2d').val()) // year, month, date
		saved_d2 = new Date(d2) // save date
	} else { // date was calculated (add/subtract controls)
		d2 = new Date(saved_d2) // use precalculated date
		$('#d2y').val(d2.getFullYear()) // update year
	}
	if (ctrlClass !== 'dateInputYear') $('#d2y').val(d2.getFullYear()) // update controls with valid values
	$('#d2m').val(d2.getMonth()+1)
	$('#d2d').val(d2.getDate())
	$('#d2full').text(monthNames(d2.getMonth())+' '+d2.getDate()+', '+d2.getFullYear()) // update date 2

	var d_min = new Date( Math.min(d1,d2) ) // dates used for calculation
	var d_max = new Date( Math.max(d1,d2) )
	var d_max_disp = new Date( Math.max(d1,d2) ) // date for display
	d_max.setDate(d_max.getDate() + endDate) // +1 day to include end date, -1 day to if necessary

	// from Date 1 to Date 2 is:
	var o = '<span class="weekDayLabel">'+dayOfWeek(d_min.getDay())+',</span>'+' '
	o += '<span class="dateFullTable2">'+monthNames(d_min.getMonth())+' '+d_min.getDate()+', '+d_min.getFullYear()+'</span>'
	o += '<br>'
	o += '<span class="dateNthLabel">'
	o += dFmt(dayOfYear(d_min))+'<span style="font-weight: 600;">'+n_th(dayOfYear(d_min), d_min.getFullYear())+' day of the year / <span>'
	o += dFmt(daysLeftInYear(d_min))+'<span style="font-weight: 600;"> days remaining</span>'
	o += '</span>'
	$('#d1full_t2').html(o)

	var o = '<span class="weekDayLabel">'+dayOfWeek(d_max_disp.getDay())+',</span>'+' '
	o += '<span class="dateFullTable2">'+monthNames(d_max_disp.getMonth())+' '+d_max_disp.getDate()+', '+d_max_disp.getFullYear()+'</span>'
	o += '<br>'
	o += '<span class="dateNthLabel">'
	o += dFmt(dayOfYear(d_max_disp))+'<span style="font-weight: 600;">'+n_th(dayOfYear(d_max_disp), d_max_disp.getFullYear())+' day of the year / <span>'
	o += dFmt(daysLeftInYear(d_max_disp))+'<span style="font-weight: 600;"> days remaining</span>'
	o += '</span>'
	$('#d2full_t2').html(o)

	// date difference
	var YMWD_arr = getYMWDdiff(d_min, d_max) // functions sort dates as well
	var YMD_arr = getYMDdiff(d_min, d_max)
	var YWD_arr = getYWDdiff(d_min, d_max)
	var YD_arr = getYDdiff(d_min, d_max)
	var MWD_arr = getMWDdiff(d_min, d_max)
	var MD_arr = getMDdiff(d_min, d_max)
	var WD_arr = getWDdiff(d_min, d_max)

	o = ''
	if (YMWD_arr.Y !== 0) { // exclude durations if less than a year
		if (YMWD_arr.M !== 0 && YMWD_arr.W !== 0) o += dDurLine( dFmt(YMWD_arr.Y,0) + dFmt(YMWD_arr.M,1) + dFmt(MWD_arr.W,2) + dFmt(YMWD_arr.D,3) )
		if (YMD_arr.M !== 0) o += dDurLine( dFmt(YMD_arr.Y,0) + dFmt(YMD_arr.M,1) + dFmt(YMD_arr.D,3) )
		if (YWD_arr.W !== 0) o += dDurLine( dFmt(YWD_arr.Y,0) + dFmt(YWD_arr.W,2) + dFmt(YWD_arr.D,3) )
		o += dDurLine( dFmt(YD_arr.Y,0) + dFmt(YD_arr.D,3) )
	}
	if (MWD_arr.M !== 0 && MWD_arr.W !== 0) o += dDurLine( dFmt(MWD_arr.M,1) + dFmt(MWD_arr.W,2) + dFmt(MWD_arr.D,3) )
	if (MD_arr.M !== 0) o += dDurLine( dFmt(MD_arr.M,1) + dFmt(MD_arr.D,3) )
	if (WD_arr.W !== 0) o += dDurLine( dFmt(WD_arr.W,2) + dFmt(WD_arr.D,3) )
	o += dDurLine( dFmt(getDayDiff(d_max, d_min),3) )

	if (endDate == 1) o += '<div><span class="dateOffsetLabel">(including end date)</span></div>'
	else if (endDate == -1) o += '<div><span class="dateOffsetLabel">(excluding start date)</span></div>'

	if (d_min.getTime() == d_max.getTime()) o = dDurLine('<span class="durVal">0</span> days') // same dates
	$('#dateDurValues').html(o)
}

function dDurLine(val) { // build string to display date duration
	val = val.trim() // remove spaces
	val = '<div><span class="dateDurLine">'+val+'</span></div>'// add class for highlighting
	return val
}

function dFmt(val, mode) { // formatting and label for date durations, y,m,w,d is 0,1,2,3 (optional)
	var o = ''
	var dLabel = ['years','months','weeks','days']
	if (val == 1) dLabel = ['year','month','week','day']
	if (typeof mode !== 'undefined') { o = '<span class="durVal">'+val+'</span>'+' '+dLabel[mode]+' ' }
	else { o = '<span class="dOfYear">'+val+'</span>' } // // day of year, days remaining
	if (val == 0 && mode == 3) o = '' // exclude "0 days"
	return o
}

function dFmt2(val, mode) { // label for date durations (array), y,m,w,d is 0,1,2,3 (optional)
	var o = ''
	var dLabel = ['years','months','weeks','days']
	if (val == 1) dLabel = ['year','month','week','day']
	if (typeof mode !== 'undefined') { o = val+' '+dLabel[mode]+' ' }
	return o
}

function n_th(i, yr) { // number ordinal suffix - 1st, 2nd, etc, marked with asterisk on leap year
	var out;
	var j = i % 10
	var k = i % 100
	if (j == 1 && k !== 11) {
		// return i + "st"
		out = "st"
	} else if (j == 2 && k !== 12) {
		out = "nd"
	} else if (j == 3 && k !== 13) {
		out = "rd"
	} else {
		out = "th"
	}
	if (isLeapYear(yr) && i >= 60) out += "*" // February 29th or March 1st
	return out
}

function toggleDateCalcMenu() {
	if (!dateCalcMenuOpened) {
		closeAllOpenedMenus()
		dateCalcMenuOpened = true

		var d2 = new Date(saved_d2) // load previously saved dates
		var d1 = new Date(saved_d1)

		var o = '<div class="dateCalcContainer">'
		o += '<input class="closeMenuBtn" type="button" value="&#215;" onclick="closeAllOpenedMenus()">'

		// table with date selection
		o += '<table class="dateCalcTable"><tbody>'
		o += '<tr><td colspan=4><span id="d1full"></span></td></tr>' // full date 1

		o += '<tr>' // controls
		o += '<td><input id="d1m" class="dateInput" type="number" step="1" min="0" max="13" value="'+(d1.getMonth()+1)+'"></td>'
		o += '<td><input id="d1d" class="dateInput" type="number" step="1" min="0" max="32" value="'+d1.getDate()+'"></td>'
		o += '<td colspan=2 style="text-align: right;"><input id="d1y" class="dateInputYear" type="number" step="1" min="1" max="9999" value="'+d1.getFullYear()+'"></td>'
		o += '</tr>'

		o += '<tr style="line-height: 0.6em;">' // labels
		o += '<td style="padding-bottom: 0.3em;"><span class="dateInputLabel">Month</span></td>'
		o += '<td style="padding-bottom: 0.3em;"><span class="dateInputLabel">Day</span></td>'
		o += '<td colspan=2 style="padding-bottom: 0.3em;"><span class="dateInputLabel">Year</span></td>'
		o += '</tr>'

		o += '<tr><td colspan=4><span id="d2full"></span></td></tr>' // full date 2

		o += '<tr>' // controls
		o += '<td><input id="d2m" class="dateInput" type="number" step="1" min="0" max="13" value="'+(d2.getMonth()+1)+'"></td>'
		o += '<td><input id="d2d" class="dateInput" type="number" step="1" min="0" max="32" value="'+d2.getDate()+'"></td>'
		o += '<td colspan=2 style="text-align: right;"><input id="d2y" class="dateInputYear" type="number" step="1" min="1" max="9999" value="'+d2.getFullYear()+'"></td>'
		o += '</tr>'

		o += '<tr style="line-height: 0.6em;">' // labels
		o += '<td style="padding-bottom: 1em;"><span class="dateInputLabel">Month</span></td>'
		o += '<td style="padding-bottom: 1em;"><span class="dateInputLabel">Day</span></td>'
		o += '<td colspan=2 style="padding-bottom: 1em;"><span class="dateInputLabel">Year</span></td>'
		o += '</tr>'

		var endCheckedState = "";
		var startCheckedState = "";
		if (endDate == 1) endCheckedState = "checked"
		if (endDate == -1) startCheckedState = "checked"
		if (!endChkEnabled) { endCheckedState = "disabled"; startCheckedState = "disabled"; }
		o += '<tr><td colspan=3 style="text-align: left;"><label class="chkLabel endDateLabel">Include End Date<input type="checkbox" id="chkbox_incEndDate" onclick="toggleEndDateCalc()" '+endCheckedState+'><span class="custChkBox"></span></label></td></tr>'
		o += '<tr><td colspan=3 style="text-align: left;"><label class="chkLabel endDateLabel">Exclude Start Date<input type="checkbox" id="chkbox_excStartDate" onclick="toggleStartDateCalc()" '+startCheckedState+'><span class="custChkBox"></span></label></td></tr>'

		// add/subtract date
		o += '<tr>'
		o += '<td colspan=2 style="padding: 0.4em 0em;"><span class="dateInputLabel">Add/Subtract</span></td>'
		o += '<td colspan=2 style="padding: 0.4em 0em;"><input class="intBtnResetDate" type="button" value="Reset All Dates" onclick="resetDateControls()"></td>'
		o += '</tr>'
		o += '<tr>'
		o += '<td><input id="offsetY" class="offsetDateInput" type="number" step="1" min="-9999" max="9999" value="'+offsetYMWD[0]+'"></td>'
		o += '<td><input id="offsetM" class="offsetDateInput" type="number" step="1" min="-9999" max="9999" value="'+offsetYMWD[1]+'"></td>'
		o += '<td><input id="offsetW" class="offsetDateInput" type="number" step="1" min="-9999" max="9999" value="'+offsetYMWD[2]+'"></td>'
		o += '<td><input id="offsetD" class="offsetDateInput" type="number" step="1" min="-9999999" max="9999999" value="'+offsetYMWD[3]+'"></td>'
		o += '</tr>'
		o += '<tr style="line-height: 0.6em;">' // labels
		o += '<td style="padding-bottom: 0.5em;"><span class="dateInputLabel">Year</span></td>'
		o += '<td style="padding-bottom: 0.5em;"><span class="dateInputLabel">Month</span></td>'
		o += '<td style="padding-bottom: 0.5em;"><span class="dateInputLabel">Week</span></td>'
		o += '<td style="padding-bottom: 0.5em;"><span class="dateInputLabel">Day</span></td>'
		o += '</tr>'

		o += '</tbody></table>'

		// table with difference between dates
		o += '<div class="dateCalcBg">'

		o += '<table class="dateCalcTable2"><tbody>'
		o += '<tr style="line-height: 0.9em;"><td><div id="dateDesc1Area"><input class="dateDescription" id="dateDesc1" value="'+dateDesc1Saved+'"></div></td></tr>' // Date 1 label
		o += '<tr style="line-height: 0.9em;"><td style="padding-bottom: 0.5em;"><span id="d1full_t2" class="dateDetailsText"></span></td></tr>' // Date 1
		o += '<tr style="line-height: 0.9em;"><td><div id="dateDesc2Area"><input class="dateDescription" id="dateDesc2" value="'+dateDesc2Saved+'"></div></td></tr>' // Date 2 label
		o += '<tr style="line-height: 0.9em;"><td style="padding-bottom: 0.5em;"><span id="d2full_t2" class="dateDetailsText"></span></td></tr>' // Date 2
		o += '<tr><td style="background: var(--menu-bg-accent); padding: 0.4em 0.75em 0.5em 0.75em;"><span id="dateDurValues" class="dateDetailsText"></span></td></tr>'
		o += '</tbody></table>'
		
		o += '</div>' // dateCalcBg

		o += '</div>' // dateCalcContainer

		document.getElementById("dateCalcMenuArea").innerHTML = o
		updDates() // update values
	} else {
		document.getElementById("dateCalcMenuArea").innerHTML = "" // close Date Calculator
		dateCalcMenuOpened = false
	}
}

function resetDateControls() {
	saved_d1 = new Date(reset_d1) // initial dates
	$('#d1y').val(saved_d1.getFullYear()) // update date1 controls
	$('#d1m').val(saved_d1.getMonth()+1)
	$('#d1d').val(saved_d1.getDate())

	saved_d2 = new Date(reset_d2)
	$('#d2y').val(saved_d2.getFullYear()) // update date2 controls
	$('#d2m').val(saved_d2.getMonth()+1)
	$('#d2d').val(saved_d2.getDate())

	document.getElementById("dateDesc1").value = "From" // clear date descriptions
	document.getElementById("dateDesc2").value = "to"

	endChkEnabled = true // allow to toggle checkbox
	$('#chkbox_incEndDate').prop("disabled", "") 
	$('#chkbox_excStartDate').prop("disabled", "") 
	endDate = 0 // exclude end date from calculation
	$('#chkbox_incEndDate').prop("checked", "") // uncheck box
	$('#chkbox_excStartDate').prop("checked", "") // uncheck box

	offsetYMWD = [0,0,0,0] // reset offset controls
	$('#offsetY').val(0)
	$('#offsetM').val(0)
	$('#offsetW').val(0)
	$('#offsetD').val(0)
	updDates() // update tables, true to reset date 2 controls
}

function toggleStartDateCalc() {
	if (endDate !== -1) {
		endDate = -1
		el = document.getElementById('chkbox_incEndDate')
		if (el !== null) el.checked = false
	} else {
		endDate = 0
	}
	updDates()
}

function toggleEndDateCalc() {
	if (endDate !== 1) {
		endDate = 1
		el = document.getElementById('chkbox_excStartDate')
		if (el !== null) el.checked = false
	} else {
		endDate = 0

	}
	updDates()
}

function isLeapYear(y) {
	return ( y%4 == 0 && y%100 !== 0 ) || y%400 == 0;
}

function monthNames(m) {
	// var mNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
	var monthArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
	return monthArr[m]
}

function dayOfYear(d) {
	tmp = new Date(d.getFullYear()-1, 11, 31) // previous year, Dec 31
	d_of_year = Math.round( (d - tmp) / 86400000 ) // day of the year
	return d_of_year
}

function daysLeftInYear(d) {
	tmp = new Date(d.getFullYear(), 11, 31) // this year, Dec 31
	d_left = Math.round( (tmp - d) / 86400000 ) // remaining days in year
	return d_left
}

function daysInMonth(m, y) { // amount of days in month for given year
	mDaysArr = [31,28,31,30,31,30,31,31,30,31,30,31] // 0 - January
	if ( m == 1 && ( (y%4 == 0 && y%100 !== 0) || y%400 == 0 ) ) return 29 // if February on leap year
	return mDaysArr[m]
}

function dayOfWeek(n) {
	var dayArr = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
	// var dayArr = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
	return dayArr[n]
}

function getYMWDdiff(d1, d2) { // year, month, week, day difference
	// console.clear()
	var d_min = new Date( Math.min(d1, d2) ) // earlier date
	var d_max = new Date( Math.max(d1, d2) ) // later date
	var y_diff = d_max.getFullYear() - d_min.getFullYear() // year difference

	var m_diff = 0
	// if month of smaller date is greater, or if same month but day of smaller date is greater
	if ( d_min.getMonth() > d_max.getMonth() || (d_min.getMonth() == d_max.getMonth() && d_min.getDate() > d_max.getDate()) ) {
		y_diff-- // last year is not full
		m_diff = d_max.getMonth() - d_min.getMonth() + 12 // partial year
	} else {
		m_diff = d_max.getMonth() - d_min.getMonth()
	}

	// console.log('d_max.getMonth()-1:'+(d_max.getMonth()-1)+' d_max.getFullYear():'+d_max.getFullYear())
	var dPrevMonth = daysInMonth(d_max.getMonth()-1, d_max.getFullYear()) // prev month from d_max

	var WD_diff; var tmp;
	var prev_date = d_min.getDate(); // last day of previous month

	if ( d_min.getDate() > d_max.getDate() ) { // less than a month
		m_diff-- // last month is not full
		// if current day of month is greater than number of days in previous month, use max available day for prev month
		if ( d_min.getDate() > dPrevMonth ) prev_date = dPrevMonth
		tmp = new Date(d_max.getFullYear(), d_max.getMonth()-1, prev_date) // switch to previous month (d_max)
		// console.log('dPrevMonth:'+dPrevMonth)
		// console.log('tmp:'+tmp.toDateString()+' d_max:'+d_max.toDateString())
	} else { // more than a month
		tmp = new Date(d_max.getFullYear(), d_max.getMonth(), d_min.getDate()) // switch to d_min date for d_max
	}
	WD_diff = getWDdiff(d_max, tmp) // get remaining week, day difference

	return {Y: y_diff, M: m_diff, W: WD_diff.W, D: WD_diff.D} // object
}

function getYMDdiff(d1, d2) { // year, month, day difference
	// console.clear()
	var d_min = new Date( Math.min(d1, d2) ) // earlier date
	var d_max = new Date( Math.max(d1, d2) ) // later date
	var y_diff = d_max.getFullYear() - d_min.getFullYear() // year difference

	var m_diff = 0
	// if month of smaller date is greater, or if same month but day of smaller date is greater
	if ( d_min.getMonth() > d_max.getMonth() || (d_min.getMonth() == d_max.getMonth() && d_min.getDate() > d_max.getDate()) ) {
		y_diff-- // last year is not full
		m_diff = d_max.getMonth() - d_min.getMonth() + 12 // partial year
	} else {
		m_diff = d_max.getMonth() - d_min.getMonth()
	}

	// console.log('d_max.getMonth()-1:'+(d_max.getMonth()-1)+' d_max.getFullYear():'+d_max.getFullYear())
	var dPrevMonth = daysInMonth(d_max.getMonth()-1, d_max.getFullYear()) // prev month from d_max

	var d_diff; var tmp;
	var prev_date = d_min.getDate(); // last day of previous month

	if ( d_min.getDate() > d_max.getDate() ) { // less than a month
		m_diff-- // last month is not full
		// if current day of month is greater than number of days in previous month, use max available day for prev month
		if ( d_min.getDate() > dPrevMonth ) prev_date = dPrevMonth
		tmp = new Date(d_max.getFullYear(), d_max.getMonth()-1, prev_date) // switch to previous month (d_max)
		// console.log('dPrevMonth:'+dPrevMonth)
		// console.log('tmp:'+tmp.toDateString()+' d_max:'+d_max.toDateString())
	} else { // more than a month
		tmp = new Date(d_max.getFullYear(), d_max.getMonth(), d_min.getDate()) // switch to d_min date for d_max
	}
	d_diff = getDayDiff(d_max, tmp) // get remaining day difference

	return {Y: y_diff, M: m_diff, D: d_diff} // object
}

function getYWDdiff(d1, d2) { // year, week, day difference
	var d_min = new Date( Math.min(d1, d2) ) // earlier date
	var d_max = new Date( Math.max(d1, d2) ) // later date
	var y_diff = d_max.getFullYear() - d_min.getFullYear() // year difference

	var tmp;
	// if month of earlier date is greater or if same month and earlier date has a greater day of month
	if ( d_min.getMonth() > d_max.getMonth() || (d_max.getMonth() == d_min.getMonth() && d_min.getDate() > d_max.getDate()) ) {
		y_diff-- // decrement year difference
		// same month, day as d_min - use prev year of d_max, since diff is less than a full year
		tmp = new Date(d_max.getFullYear()-1, d_min.getMonth(), d_min.getDate())
	} else {
		// same month, day as d_min - use year of d_max since diff is more than a full year
		tmp = new Date(d_max.getFullYear(), d_min.getMonth(), d_min.getDate())
	}

	var WD_diff = getWDdiff(d_max, tmp) // get week, day difference
	return {Y: y_diff, W: WD_diff.W, D: WD_diff.D} // object
}

function getYDdiff(d1, d2) { // year, day difference
	var d_min = new Date( Math.min(d1, d2) ) // earlier date
	var d_max = new Date( Math.max(d1, d2) ) // later date
	var y_diff = d_max.getFullYear() - d_min.getFullYear() // year difference

	var tmp;
	// if month of earlier date is greater or if same month and earlier date has a greater day of month
	if ( d_min.getMonth() > d_max.getMonth() || (d_max.getMonth() == d_min.getMonth() && d_min.getDate() > d_max.getDate()) ) {
		y_diff-- // decrement year difference
		// same month, day as d_min - use prev year of d_max, since diff is less than a full year
		tmp = new Date(d_max.getFullYear()-1, d_min.getMonth(), d_min.getDate())
	} else {
		// same month, day as d_min - use year of d_max since diff is more than a full year
		tmp = new Date(d_max.getFullYear(), d_min.getMonth(), d_min.getDate())
	}

	var d_diff = getDayDiff(d_max, tmp) // get day difference
	return {Y: y_diff, D: d_diff} // object
}

function getMWDdiff(d1, d2) { // month, week, day difference
	var d_min = new Date( Math.min(d1, d2) ) // earlier date
	var d_max = new Date( Math.max(d1, d2) ) // later date
	var y_diff = d_max.getFullYear() - d_min.getFullYear() // year difference

	m_diff = y_diff * 12 // month difference (full years)
	m_diff += d_max.getMonth() - d_min.getMonth() // partial year

	var dPrevMonth = daysInMonth(d_max.getMonth()-1, d_max.getFullYear()) // prev month from d_max

	var WD_diff; var tmp;
	var prev_date = d_min.getDate(); // last day of previous month

	if ( d_min.getDate() > d_max.getDate() ) { // less than a month
		m_diff-- // last month is not full
		// if current day of month is greater than number of days in previous month, use max available day for prev month
		if ( d_min.getDate() > dPrevMonth ) prev_date = dPrevMonth
		tmp = new Date(d_max.getFullYear(), d_max.getMonth()-1, prev_date) // switch to previous month (d_max)
	} else { // more than a month
		tmp = new Date(d_max.getFullYear(), d_max.getMonth(), d_min.getDate()) // switch to d_min date for d_max
	}
	WD_diff = getWDdiff(d_max, tmp) // get remaining week, day difference

	return {M: m_diff, W: WD_diff.W, D: WD_diff.D} // object
}

function getMDdiff(d1, d2) { // month, day difference
	// console.clear()
	var d_min = new Date( Math.min(d1, d2) ) // earlier date
	var d_max = new Date( Math.max(d1, d2) ) // later date
	var y_diff = d_max.getFullYear() - d_min.getFullYear() // year difference

	m_diff = y_diff * 12 // month difference (full years)
	m_diff += d_max.getMonth() - d_min.getMonth() // partial year

	// console.log('d_max.getMonth()-1:'+(d_max.getMonth()-1)+' d_max.getFullYear():'+d_max.getFullYear())
	var dPrevMonth = daysInMonth(d_max.getMonth()-1, d_max.getFullYear()) // prev month from d_max

	var d_diff; var tmp;
	var prev_date = d_min.getDate(); // last day of previous month

	if ( d_min.getDate() > d_max.getDate() ) { // less than a month
		m_diff-- // last month is not full
		// if current day of month is greater than number of days in previous month, use max available day for prev month
		if ( d_min.getDate() > dPrevMonth ) prev_date = dPrevMonth
		tmp = new Date(d_max.getFullYear(), d_max.getMonth()-1, prev_date) // switch to previous month (d_max)
		// console.log('dPrevMonth:'+dPrevMonth)
		// console.log('tmp:'+tmp.toDateString()+' d_max:'+d_max.toDateString())
	} else { // more than a month
		tmp = new Date(d_max.getFullYear(), d_max.getMonth(), d_min.getDate()) // switch to d_min date for d_max
	}
	d_diff = getDayDiff(d_max, tmp) // get remaining day difference

	return {M: m_diff, D: d_diff} // object
}

function getWDdiff(d1, d2) { // week, day difference
	d_diff = Math.round( Math.abs(d2-d1) / 86400000 )
	w_diff = Math.floor(d_diff / 7)
	d_diff -= w_diff*7
	return {W: w_diff, D: d_diff} // object
}

function getDayDiff(d1, d2) { // days
	return Math.round( Math.abs(d2-d1) / 86400000 )
}

function compareDateArray(dArrRaw) { // array as input, e.g. ["09/30/2020", "09/15/2021"]
	var i, n, d_min, d_max, d_min_comment, d_max_comment
	var dArr = []; var tmp = ""; var tmp2 = []; var tmpComment = ""
	for (i = 0; i < dArrRaw.length; i++) { // parse dates
		tmpComment = "" // reset
		commentMatch = dArrRaw[i].match(/\[.+\]/g) // find comment
		if (commentMatch !== null) { tmpComment = commentMatch[0].slice(1,-1) } // remove brackets
		tmp = dArrRaw[i].replace(/\[.+\]/g, '').trim() // remove comment
		tmp2 = tmp.split('/') // split m/d/y "09/30/2020" into array
		dArr.push( [new Date(tmp2[2], tmp2[0]-1, tmp2[1]), tmpComment] ); // y,m,d - month is minus one, [0] - date, [1] - comment
	}
	var datePairs = []
	for (i = 0; i < dArr.length; i++) { // construct date pairs
		for (n = i+1; n < dArr.length; n++) { // start with the next index
			d_min = new Date( Math.min(dArr[i][0], dArr[n][0]) ) // earlier date
			d_max = new Date( Math.max(dArr[i][0], dArr[n][0]) ) // later date
			if (dArr[i][0] < dArr[n][0]) { // assign comments to each date
				d_min_comment = dArr[i][1]
				d_max_comment = dArr[n][1]
			} else {
				d_min_comment = dArr[n][1]
				d_max_comment = dArr[i][1]
			}
			if (d_min_comment == "") d_min_comment = "Start Date"
			if (d_max_comment == "") d_max_comment = "End Date"
			datePairs.push( [d_min, d_min_comment, d_max, d_max_comment] )
		}
	}

	var o = ""
	var YMWD_arr, YMD_arr, YWD_arr, YD_arr, MWD_arr, MD_arr, WD_arr
	for (i = 0; i < datePairs.length; i++) { // for each date pair
		d_min = datePairs[i][0]
		d_max = datePairs[i][2]
		YMWD_arr = getYMWDdiff(d_min, d_max) // functions sort dates as well
		YMD_arr = getYMDdiff(d_min, d_max)
		YWD_arr = getYWDdiff(d_min, d_max)
		YD_arr = getYDdiff(d_min, d_max)
		MWD_arr = getMWDdiff(d_min, d_max)
		MD_arr = getMDdiff(d_min, d_max)
		WD_arr = getWDdiff(d_min, d_max)

		// combine digits for date duration
		YMWD_all = concat_YMWD(YMWD_arr)
		YMD_all = concat_YMWD(YMD_arr)
		YWD_all = concat_YMWD(YWD_arr)
		YD_all = concat_YMWD(YD_arr)
		MWD_all = concat_YMWD(MWD_arr)
		MD_all = concat_YMWD(MD_arr)
		WD_all = concat_YMWD(WD_arr)

		// -1 day (negative)
		d_max_n1 = new Date(d_max.getFullYear(), d_max.getMonth(), d_max.getDate()-1)
		YMWD_all_n1 = concat_YMWD(getYMWDdiff(d_min, d_max_n1))
		YMD_all_n1 = concat_YMWD(getYMDdiff(d_min, d_max_n1))
		YWD_all_n1 = concat_YMWD(getYWDdiff(d_min, d_max_n1))
		YD_all_n1 = concat_YMWD(getYDdiff(d_min, d_max_n1))
		MWD_all_n1 = concat_YMWD(getMWDdiff(d_min, d_max_n1))
		MD_all_n1 = concat_YMWD(getMDdiff(d_min, d_max_n1))
		WD_all_n1 = concat_YMWD(getWDdiff(d_min, d_max_n1))

		// +1 day (positive)
		d_max_p1 = new Date(d_max.getFullYear(), d_max.getMonth(), d_max.getDate()+1)
		YMWD_all_p1 = concat_YMWD(getYMWDdiff(d_min, d_max_p1))
		YMD_all_p1 = concat_YMWD(getYMDdiff(d_min, d_max_p1))
		YWD_all_p1 = concat_YMWD(getYWDdiff(d_min, d_max_p1))
		YD_all_p1 = concat_YMWD(getYDdiff(d_min, d_max_p1))
		MWD_all_p1 = concat_YMWD(getMWDdiff(d_min, d_max_p1))
		MD_all_p1 = concat_YMWD(getMDdiff(d_min, d_max_p1))
		WD_all_p1 = concat_YMWD(getWDdiff(d_min, d_max_p1))

		o += '=========================================================================\n'
		o += d_min.getMonth()+1 + '/' + d_min.getDate() + '/' + d_min.getFullYear() + ' | '
		o += monthNames(d_min.getMonth()) + ' ' + d_min.getDate() + ', ' + d_min.getFullYear() + ' (' + dayOfYear(d_min) + '/' + daysLeftInYear(d_min) + ') - ' + datePairs[i][1] + '\n' // date - comment
		o += d_max.getMonth()+1 + '/' + d_max.getDate() + '/' + d_max.getFullYear() + ' | '
		o += monthNames(d_max.getMonth()) + ' ' + d_max.getDate() + ', ' + d_max.getFullYear() + ' (' + dayOfYear(d_max) + '/' + daysLeftInYear(d_max) + ') - ' + datePairs[i][3] + '\n' // date - comment
		o += '-------------------------------------------------------------------------\n'
		if (YMWD_arr.Y !== 0) { // exclude durations if less than a year
			o += padStr((dFmt2(YMWD_arr.Y,0) + dFmt2(YMWD_arr.M,1) + dFmt2(MWD_arr.W,2) + dFmt2(YMWD_arr.D,3)).trim()) + '| '
			o += YMWD_all + '; '+ YMWD_all_n1 + ';(-1) ' + YMWD_all_p1 + ';(+1)\n'
			o += padStr((dFmt2(YMD_arr.Y,0) + dFmt2(YMD_arr.M,1) + dFmt2(YMD_arr.D,3)).trim()) + '| '
			o += YMD_all + '; '+ YMD_all_n1 + ';(-1) ' + YMD_all_p1 + ';(+1)\n'
			o += padStr((dFmt2(YWD_arr.Y,0) + dFmt2(YWD_arr.W,2) + dFmt2(YWD_arr.D,3)).trim()) + '| '
			o += YWD_all + '; '+ YWD_all_n1 + ';(-1) ' + YWD_all_p1 + ';(+1)\n'
			o += padStr((dFmt2(YD_arr.Y,0) + dFmt2(YD_arr.D,3)).trim()) + '| '
			o += YD_all + '; '+ YD_all_n1 + ';(-1) ' + YD_all_p1 + ';(+1)\n'
		}

		o += padStr((dFmt2(MWD_arr.M,1) + dFmt2(MWD_arr.W,2) + dFmt2(MWD_arr.D,3)).trim()) + '| '
		o += MWD_all + '; '+ MWD_all_n1 + ';(-1) ' + MWD_all_p1 + ';(+1)\n'
		o += padStr((dFmt2(MD_arr.M,1) + dFmt2(MD_arr.D,3)).trim()) + '| '
		o += MD_all + '; '+ MD_all_n1 + ';(-1) ' + MD_all_p1 + ';(+1)\n'
		o += padStr((dFmt2(WD_arr.W,2) + dFmt2(WD_arr.D,3)).trim()) + '| '
		o += WD_all + '; '+ WD_all_n1 + ';(-1) ' + WD_all_p1 + ';(+1)\n'
		o += padStr((dFmt2(getDayDiff(d_max, d_min),3)).trim()) + '| '
		o += getDayDiff(d_max, d_min) + '; ' + parseInt(getDayDiff(d_max, d_min)-1) + ';(-1) ' + parseInt(getDayDiff(d_max, d_min)+1) + ';(+1)\n\n\n'
	}
	o = o.slice(0,-3) // remove last line breaks
	return o
}

function concat_YMWD(obj) { // object .Y/M/W/D
	var str = ""
	if (obj.Y !== undefined) str += obj.Y
	if (obj.M !== undefined) str += obj.M
	if (obj.W !== undefined) str += obj.W
	if (obj.D !== undefined) str += obj.D
	str = str.replace(/(^0|0$)/g, "") // removes zeroes from both sides
	return str
}

function padStr(str, chars = 40) { // add spaces to string to match length
	var i = 0
	n_sp = chars - str.length
	while (i < n_sp) { str += " "; i++ }
	return str
}