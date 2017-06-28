/* Created by Maltseva 05.12.2016.*/

/*The DateTimePicker is a plugin that works on the base of JQuery and adds date- and timepicker functionality to your pages. 
You can customize the date format and language, restrict the selectable date ranges and add in buttons and other navigation 
options.

By default, the datepicker calendar and timepicker open in a small overlay when the associated text field gains focus. 
For an inline calendar and time, simply attach the datepicker to a div or span.*/

/*Usage

Include jquery-ui.min.css, jquery-3.1.1.min.js, jquery-ui.min.js, date in your page.
Options is an optional javascript object with parameters explained below.
You can also set options as data attributes on the intput elements, like <input type="text" data-time-format="H:i:s" />

*/

function appearAnimation(element, i, step, speed){
    var tranopacity;

    i = i || 0;

    step = step || 5;

    speed = speed || 50; 

    tranopacity = setInterval(function(){

        var opacity = i / 100;

        i = i + step; 
        if(opacity > 1 || opacity < 0){
            clearInterval(tranopacity);
            return; 
        }

        element.style.opacity = opacity;
        //older IE
        element.style.filter = 'alpha(opacity=' + opacity * 100 + ')';
    }, speed);
}

function api_GetHTimeSec(offset)
{
	var d;
	d = new Date();
	if(offset !== undefined && offset != 0){
		d.setTime(d.getTime() + offset * 1000);
	}
	return ('0'+ d.getDate()).slice(-2)+'.'+
	('0'+(d.getMonth() + 1)).slice(-2)+'.'+
	(d.getYear() + 1900)+' '+
	('0'+d.getHours()).slice(-2)+':'+
	('0'+d.getMinutes()).slice(-2)+':'+
	('0'+d.getSeconds()).slice(-2);

	/*return d.getDate()+'.'+
	(d.getMonth() + 1)+'.'+
	(d.getYear() + 1900)+' '+
	d.getHours()+':'+
	d.getMinutes()+':'+
	d.getSeconds();*/
}


function validateTime (evt)
{
	var inputTimeField = api_EvtSrc(evt);
	var isTimeValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(inputTimeField.value);
  
	if (isTimeValid) {
		return true;
	} 
	else 
	{
		return false;
	}  
};


function validateDate (evt)
{
	var inputDateField = api_EvtSrc(evt);
	var isDateValid = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/.test(inputDateField.value);
    
	if(isDateValid) {
		return true;
	} 
	else 
	{
		return false;
	}
};


function positionAt (anchor, position, elem) 
{
	var anchorCoords = anchor.getBoundingClientRect();
	
	switch (position)
	 {
	case "top":
	elem.style.left = anchorCoords.left + "px";
	elem.style.top = anchorCoords.top - elem.offsetHeight + "px";
	break;

	case "right":
	elem.style.left = anchorCoords.left + anchor.offsetWidth + "5px";
	elem.style.top = anchorCoords.top + "px";
	break;

	case "bottom":
	elem.style.left = anchorCoords.left + "px";
	elem.style.top = anchorCoords.top + anchor.offsetHeight + "px";
	break;
	}
}


function DateTimepicker (options) 
{
	this.tmTimer = null; //
	this.dateTimer = null; //
	var that = this;

	this.getObj = function (id)
    {
		return document.getElementById(id);
    }
	
	this.getSrc = (function (evt)
	{
		return evt.target ? evt.target : evt.srcElement;
	});
	this.JqueryFunc = jQuery(document).ready(function($) {
	// no animation for calendar 
		jQuery.fx.off = true;
		/*$.datepicker.regional['ru'] = {
		onDone: null,
		closeText: 'Закрыть',
		currentText: 'Сегодня',
		monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь',
		'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
		monthNamesShort: ['Янв','Фев','Мар','Апр','Май','Июн',
		'Июл','Авг','Сен','Окт','Ноя','Дек'],
		dayNames: ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'],
		dayNamesShort: ['вск','пнд','втр','срд','чтв','птн','сбт'],
		dayNamesMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
		dateFormat: 'dd.mm.yy',
		firstDay: 1,
		readonly: "true",
		isRTL: false
		};	*/

		$('.dateInput').datepicker({
			showOn: 'button',
			buttonText: " ",
			prevText: "",
			nextText: ""
		});
        
		$('.ui-datepicker-trigger').click(function() {

		  that.hideTimeWindow();
		});
		$('.btnTime').click(function() {
			$('.tableClass').show();
		});

	});
	this.timeOpened = 0;
	this.createTimeWindow(6, 4);
	this.tags = [];

}

DateTimepicker.prototype.addDataToContainer = function (container, options)
{
	var item, container;
	var that = this;

	item = {};

	item.dateDiv = this.createElement('div', container);
	item.dateDiv.className = 'divDate';
	item.dateInput = this.createElement('input', item.dateDiv);
	item.dateInput.className = 'dateInput';

	item.dateBtn = this.createElement('span', item.dateDiv);
	item.dateBtn.className = 'btnDate';
	item.dateBtn.style.display = 'none';

	item.timeDiv = this.createElement('div', container);
	item.timeDiv.className = 'divTime';
	item.timeInput = this.createElement('input', item.timeDiv);
	item.timeInput.className = 'timeInput';
	item.timeBtn = this.createElement('span', item.timeDiv);
	item.timeBtn.className = 'btnTime';
  
	
	if(options !== undefined && 'time' in options)
	{
		var rexp = /(\d+\.\d+\.\d+) (\d+:\d+:\d+)/;
		var res;
		if((res = rexp.exec(options.time)))
		{
			item.dateInput.value = res[1];
			item.timeInput.value = res[2];
		}
	}
	else if (options !== undefined && 'time-millisec' in options) 
	{
		var rexp = /^(\d+)-(\d+)-(\d+) (\d+):(\d+):(\d+)\.(\d+)Z$/;
		var res;
		if ((res = rexp.exec(options.time-millisec)))
		{
			item.dateInput.value = res[1];
			item.timeInput.value = res[2];
		}
		if (item.dateInput.value && item.timeInput.value) 
		{
			if(!(res = rexp.exec(item.dateInput.value || item.timeInput.value)))
			{
				alert('Неверный формат даты');
			}
		
		}
	}
	

	if(options !== undefined) {
		if('background' in options) item.timeDiv.style.background = options.background;
		if('border' in options) item.timeDiv.style.border = options.border;
	}

	item.timeInput.addEventListener('input', function (evt) {
		if (validateTime(evt) == true) {
			item.timeDiv.style.backgroundColor = '#fff';
		}
		else 
		{
			item.timeDiv.style.backgroundColor = '#fba';
		};
	});
	
	item.dateInput.oninput = function(evt) 
	{	
		if (validateDate(evt) == true) {
			item.dateDiv.style.backgroundColor = '#fff';
		} 
		else {
			item.dateDiv.style.backgroundColor = '#fba';
		};
	}

	item.timeBtn.addEventListener("click", function (evt) 
	{
		if(that.timeOpened && that.item == item) {
				that.hideTimeWindow();
		}
		else {
			that.showTimeWindow(item);
			item.tmDiv = positionAt(item.timeInput, 'bottom', that.tmTable);
		}
		evt.stopPropagation();
	}); 
		
	this.tmTable.onmouseout = function (evt)
	{
		//console.log('mouse out');
		if(that.tmTimer == null)
		{
			that.tmTimer = setTimeout(function (evt)
			{
				item.tmDiv.style.display = 'none';
				that.tmTimer = null;
			}, 5000); 
		}
	};
  
	this.tmTable.onmouseover = function ()
	{
		//console.log('mouse over');
		if(that.tmTimer != null)
		{
			clearTimeout(that.tmTimer);
			that.tmTimer = null;
		}
	}

	item.getDate = function ()
	{
		var res1, rexp1 = /(\d+).(\d+).(\d+)/;
		var res2, rexp2 = /(\d+):(\d+)(:(\d+))?/;
	
		if(!(res1 = rexp1.exec(item.dateInput.value))){
			return null;
		}
		if(!(res2 = rexp2.exec(item.timeInput.value))){
			return null;
		}

		if(res2.length < 4){
			res2[4] = '0';
		}
		return new Date(res1[3], res1[2] - 1, res1[1], res2[1], res2[2], res2[4]);
	}

	return item;
	
}

DateTimepicker.prototype.addContainer = function (container_name, options)
{
	var item, container;
	var that = this;

	item = {};

	container = this.getObj(container_name);

	item.dateDiv = this.createElement('div', container);
	item.dateDiv.className = 'divDate';
	item.dateInput = this.createElement('input', item.dateDiv);
	item.dateInput.className = 'dateInput';

	item.dateBtn = this.createElement('span', item.dateDiv);
	item.dateBtn.className = 'btnDate';
	item.dateBtn.style.display = 'none';

	item.timeDiv = this.createElement('div', container);
	item.timeDiv.className = 'divTime';
	item.timeInput = this.createElement('input', item.timeDiv);
	item.timeInput.className = 'timeInput';
	item.timeBtn = this.createElement('span', item.timeDiv);
	item.timeBtn.className = 'btnTime';
	
	if(options !== undefined && 'time' in options)
	{
		var rexp = /(\d+\.\d+\.\d+) (\d+:\d+:\d+)/;
		var res;
		if((res = rexp.exec(options.time)))
		{
			item.dateInput.value = res[1];
			item.timeInput.value = res[2];
		}
	}
	else if (options !== undefined && 'time-millisec' in options) 
	{
		var rexp = /^(\d+)-(\d+)-(\d+) (\d+):(\d+):(\d+)\.(\d+)Z$/;
		var res;
		if ((res = rexp.exec(options.time-millisec)))
		{
			item.dateInput.value = res[1];
			item.timeInput.value = res[2];
		}
		if (item.dateInput.value && item.timeInput.value) 
		{
			if(!(res = rexp.exec(item.dateInput.value || item.timeInput.value)))
			{
				alert('Неверный формат даты');
			}
		}
	}
	

	if(options !== undefined) {
		if('background' in options) item.timeDiv.style.background = options.background;
		if('border' in options) item.timeDiv.style.border = options.border;
	}

	item.timeInput.addEventListener('input', function (evt) {
		if (validateTime(evt) == true) {
			item.timeDiv.style.backgroundColor = '#fff';
		}
		else 
		{
			item.timeDiv.style.backgroundColor = '#fba';
		};
	});
	
	item.dateInput.oninput = function(evt) 
	{	
		if (validateDate(evt) == true) {
			item.dateDiv.style.backgroundColor = '#fff';
		} 
		else {
			item.dateDiv.style.backgroundColor = '#fba';
		};
	}

	item.timeBtn.addEventListener("click", function (evt) 
	{
		if(that.timeOpened && that.item == item) {
				that.hideTimeWindow();
		}
		else {
			that.showTimeWindow(item);
			item.tmDiv = positionAt(item.timeInput, 'bottom', that.tmTable);
		}
		evt.stopPropagation();
	}); 
		
  
	this.tmTable.onmouseover = function ()
	{
		//console.log('mouse over');
		if(that.tmTimer != null)
		{
			clearTimeout(that.tmTimer);
			that.tmTimer = null;
		}
	}

	item.getDate = function ()
	{
		var res1, rexp1 = /(\d+).(\d+).(\d+)/;
		var res2, rexp2 = /(\d+):(\d+)(:(\d+))?/;
	
		if(!(res1 = rexp1.exec(item.dateInput.value))){
			return null;
		}
		if(!(res2 = rexp2.exec(item.timeInput.value))){
			return null;
		}

		if(res2.length < 4){
			res2[4] = '0';
		}
		return new Date(res1[3], res1[2] - 1, res1[1], res2[1], res2[2], res2[4]);
	}

	return item;

}


DateTimepicker.prototype.createElement = function (tag_name, parent_obj)
{
	var newElement = document.createElement(tag_name);
	parent_obj.appendChild(newElement);
	return newElement;
}		


DateTimepicker.prototype.createTimeWindow = function (rows, columns)
{
	var that = this;
   
	this.tmDiv = this.createElement('div', document.body);
	this.tmDiv.style.display = 'none';
		 
	var cellClick = function(evt)
	{
		var obj = that.getSrc(evt);
		that.item.timeInput.value = obj.innerHTML + ':00';
		that.item.timeInput.focus();
		that.hideTimeWindow();
	}
	
	this.tmTable = this.createElement('table', this.tmDiv);
	this.tmTable.className = 'tableClass';
  	
	var row, cell, r, c, hour = 0;

	for(r = 0; r < rows; r++)
	{
	row = this.createElement('tr', this.tmTable);
	row.className = 'rowClass';
	
		for(c = 0; c < columns; c++)
		{
		cell = this.createElement('td', row);
		cell.className = 'cellClass';
		cell.innerHTML = hour + ':00';
		cell.addEventListener("click", cellClick);
		
		hour++;
		}		
	}
	document.addEventListener("click", function (evt)
	{
		this.tmpl = document.querySelector('button').onclick;
		if(that.timeOpened)
		{
			that.hideTimeWindow();
		} 
	});
	document.body.addEventListener("keyup", function(evt) {
		clearTimeout(that.tmTimer);
		if(that.timeOpened )
		{ 
			that.hideTimeWindow();
		}
	});

}


DateTimepicker.prototype.hideTimeWindow = function (evt)
{
	
	this.tmDiv.style.display = 'none';
	this.timeOpened = 0;
	this.item = undefined;
	document.onclick = this.oldDocClick;
	
}


DateTimepicker.prototype.showTimeWindow = function (item)
{

	this.tmDiv.style.display = 'block';
	this.timeOpened = 1;
	this.item = item;
	this.oldDocClick = document.onclick;
	
}
