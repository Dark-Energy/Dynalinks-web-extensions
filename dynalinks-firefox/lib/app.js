
/*
APPLICATION
*/


var mr;

function Application()
{

}

Application.prototype.create_database = function(dynalinks)
{
    if (!dynalinks) {
        console.error("Happened something horroribie! Dyanlinks database, getting to application is empty!");
        return;
    }
    console.log("Application create database...");
	this.database = dynalinks.database;
	this.dynalinks = dynalinks;
	this.get_database_name();    
	
	var self = this;
    if (this.initialize()) {
        this.initialize();
	}
}

Application.prototype.remove_item = function(id)
{
	var self = this;
	var params = 
	{
		'type': 'label', 
		value: 'Правда удалить?', 
		handler: function (value) 
		{
			self.dynalinks.remove_by_id(id);
		}
	};
	var form = new PopupForm(params);
	form.show();
}

Application.prototype.move_tag = function ()
{
	var params = {}
	params.title = "Перенести страницу в другую категорию";
	params.type = "custom";
	params.dict = this.dynalinks.names;
	params.fields = [
		{"type": "select", 
		"dict":this.dynalinks.names,
		"data-value": "category"
		},
		{"type":"text",
		"data-value": "new_category"
		}
	];
	var self = this;
	params.handler = function (value) {
		var tag = self.dynalinks.context.current_tag;
		var source_category = self.dynalinks.context.category_name;
		var new_category = value.new_category || value.category;
		self.dynalinks.move_tag(
			tag, 
			source_category, 
			new_category);
		//3. reshow page
		mr.navigate( self.dynalinks.create_url(new_category,tag), true);

	}
	var form = new PopupForm(params);
	form.show();
}

//show form and add link to database
Application.prototype.add_item = function ()
{
}


Application.prototype.edit_item = function (id)
{
	var item = this.dynalinks.get_from_active_context(id);
	var params = {
		'type': 'custom'
	};
	
	//create edit form
	var foo = document.createElement("div");
	var context = {};
	context.tags = this.dynalinks.context.tags;
	context.item = item;
	ko.renderTemplate("edit-item-template", context, {}, foo);
	params.form = foo;	

	var self = this;
	params.handler = function (value) 
	{
		var result = self.dynalinks.update_item(item, value);
		mr.navigate(self.dynalinks.create_url(result.category, result.tag), true);			
	}
	var form = new PopupForm(params);
	form.show();
	
}

Application.prototype.turn_edit = function ()
{
	if (this.dynalinks.display.mode === "page_view") {
		this.dynalinks.display.mode = "page_edit";
	}
	else {
		this.dynalinks.display.mode = "page_view";
	}
	this.dynalinks.show_page(this.dynalinks.context.current_tag);
}

Application.prototype.export_category = function ()
{
    var saver = new Dynalinks_File_Proxy(this.dynalinks);
	saver.export_category(this.dynalinks.context.category_name);
}

Application.prototype.export_tag = function ()
{
    var saver = new Dynalinks_File_Proxy(this.dynalinks);
	saver.export_tag(this.dynalinks.context.category_name, 
		this.dynalinks.context.current_tag);
}

Application.prototype.remove_category = function ()
{
	var params = {
		"type": "label",
		"value": "Правда удалить эту категорию?"
	};
	var self = this;
	params.handler = function (value) {
		self.dynalinks.remove_category(self.dynalinks.context.category_name);
        var key = get_first_key(self.dynalinks.names);
		mr.navigate(self.dynalinks.create_url(key), true);
	}
	var form = new PopupForm(params);
	form.show();
}

Application.prototype.remove_tag = function ()
{
	var params = {
		"type": "label",
		"value": "Правда удалить эту страницу?"
	};
	var self = this;
	params.handler = function (value) {
		self.dynalinks.remove_tag(
			self.dynalinks.context.category_name, 
			self.dynalinks.context.current_tag
			);
		mr.navigate(self.dynalinks.create_url(self.dynalinks.context.category_name), true);
	}
	var form = new PopupForm(params);
	form.show();
}

Application.prototype.create_category = function ()
{
	var params = {};
	params.type = "text";
	params.title = "Название новой папки";
	var self  = this;
	params.handler = function (value) {
		self.dynalinks.add_category(value);
		mr.navigate(self.dynalinks.create_url(value), true);
	}
	var form = new PopupForm(params);
	form.show();
}

Application.prototype.move_item = function ()
{
	
}


Application.prototype.search = function (text)
{
	var value = text.trim();
	if (!value) {
		return;
	}
	mr.navigate(create_url("search", value), true);
}
	
Application.prototype.show_search_results = function (value)
{
	var results = this.dynalinks.search(["text", "href"], value);	

	var context = 
	{
		results:results
	};
	var view = document.getElementById("page-content");
	ko.cleanNode(view);
	view.innerHTML = '';
	
	ko.renderTemplate("template-search-result", context, {}, view);	
}

Application.prototype.init_router = function()
{
}


//hack, get database name for 'save' function
Application.prototype.get_database_name = function ()
{
    return "dynalinks_" + new Date().dateString + "_.txt";
}

Application.prototype.save_to_file = function (filename)
{
    var saver = new Dynalinks_File_Proxy(this.dynalinks);
	saver.save_to_file(filename || this.Save_Filename);
}

Application.prototype.initialize = function ()
{
	this.init_router();
	if (this._child_init) {
		this._child_init();
	}
	
}




;


function Dynalinks_File_Proxy(dlink)
{
    this.dlink = dlink;
    this.dynalinks = dlink;
}

copy_object(Dynalinks_File_Proxy.prototype, {
    constructor: Dynalinks_File_Proxy,
    save_to_file : function (filename, varname)
    {
        var json = this.dlink.toJSON();
        this.save_data_to_file(filename || this.Database_Name, json, this.Database_Var);
    },
    
    save_data_to_file : function(filename, data, varname)
    {
        var text = JSON.stringify(data, null, " ");
        text = "var " + varname + " = " + text + ";\n";
        var blob = new Blob([text], {type: "text/plain;charset=utf-8"});	
        console.log("blob created.... saving");
        saveAs(blob, filename); 
    },
    
    Database_Name : "database.txt",
    
   Database_Var : "my_links",
   
    export_tag : function (category, tag)
    {
        var context = this.dlink.get_category_context(category);
        var data = context.pages[tag];
        this.save_data_to_file(tag + ".txt", data, "my_page");
    },
    
    export_category : function (name)
    {
        this.save_data_to_file(name + ".txt", this.dlink.database[name], "my_cat");
    }
});

;
/*if not given, then input elements will create by "type" parameterform - DOM node, contains custom form's fieldstype - type of generated input element, one of "select", "text", "label", "custom"'custom' means to use DOM given in 'form' fielddict - data for "select" input, array or dictionary, where key became 'value' attribue of 'option' element, and value became text{option1 value: option1 text,option2 value: option2 text}value - selected item for "select" input elementparams.type = 'select';params.dict = {"1": "one","2": "two"};params.value = "1";value - value by default for text input elementparams.type = 'text';params.value = 'dummy';params.type = 'label';params.value = 'Title text';handler - callback function, call if user click "ok" buttontitle - title of forminput-container - if form generated, then it may give class name or id of DOM element, witch contain input element, optional, default value 'mt-input-container'not_escape - if ture, not escape/sanitize text input. optional. default value false.fields = [	{	type: select,	options : 		{			"one": "1",			"two": "2"		}	value: "1"	"data-value": "tag"	},	{		type: text,		"data-value": "comment"	}]*/var Form_Fabric = {};Form_Fabric.escape_text = function (text){	if (this.not_escape)		return text;	return text.replace(/'|"/g, '&quot;').replace(/</g, '$lt;').replace(/>/g, '$gt;');}Form_Fabric["select"] = function (dict, selected){	var selected_is_defined = !(typeof selected === 'undefined');	var html = '';	if (Array.isArray(dict)){		for (var key = 0, len = dict.length; key < len; key++){				html += '<option value="' + key + '"';			if (selected_is_defined && selected == key) {				html += " selected ";			}			html += '>' + dict[key]+'</option>';		}	}	else {		for (var key in dict) {			if (Object.prototype.hasOwnProperty.call(dict, key)) {				html += '<option value="' + key + '"';				if (selected_is_defined && selected === key) {					html += " selected ";				}				html += '>' + dict[key]+'</option>';			}		}	}	var form = document.createElement('select');	form.innerHTML = html;	return form;} Form_Fabric["text"] = function (value){	var input = document.createElement('input');	input.type = 'text';	if (value) {		input.value = Form_Fabric.escape_text(value || "");	}	return input;}Form_Fabric["label"] = function (value){	var form = document.createElement('div');	form.className = "popup-form-static-text";	form.style["text-align"] = "center";	form.innerHTML = '<h3>' + Form_Fabric.escape_text(value || " ") + '</h3>';	return form;}Form_Fabric["textarea"] = function (value){	var form = document.createElement('textarea');	if (value) {		form.value = Form_Fabric.escape_text(value || "");	}	return form;}Form_Fabric.create = function (type, value, dict){	var f = this[type];	if (!f) {		throw ("Popup_Form can't create form, parameter 'type' is unknown value", type);	}	var form;	if (type === "select") {		form = f(dict, value);	}	else {		form =  f(value);	}	return form;}Form_Fabric.create_fields = function (fields){	var item, input, div;	var form = document.createElement("div");	for(var i = 0; i < fields.length; i++) {		item = fields[i];		input = this.create(item.type, item.value, item.dict);		if ("data-value" in item) {			input.setAttribute("data-value", item["data-value"]);		}		div = document.createElement("div");		div.className = "dummy";		div.appendChild(input);		form.appendChild(div);	}	return form;}function PopupForm(params){	this.dict = params.dict;		this.selected = params.selected; 	this.type = params.type;	this.template = params.template;		this.handler = params.handler;	this.change_text = params.change_text;	this.title = params.title;	this.not_escape = params.not_escape;			this.text = "";	this.result = -1;	var empty = true;		this.initialize = function ()	{		if (!empty) return;				Form_Fabric.not_escape = !!params.not_escape;		if (params.form) {			this.form = params.form;		}		else if (params.fields) {			this.form = Form_Fabric.create_fields(params.fields);		}		else  {			this.form = Form_Fabric.create(params.type, params.value, params.dict);		}		this.create_template(params);				{			var t = this.template.querySelector(".mt-input-container");			if (!t) {				t = document.createElement("div");				t.className = "mt-input-container";				console.log("not found mt-input-container, need create it");				this.template.appendChild(t);			}			else {				t.innerHTML = '';			}			t.appendChild(this.form);			//обработчики кнопок, если они есть...			var self = this;			t = this.template.querySelector(".edit-form-ok-btn");			t.onclick = function (e) {self._ok();}			t = this.template.querySelector(".edit-form-cancel-btn");			t.onclick = function (e) {self.cancel();}		}				this.init();		empty = false;	}	}PopupForm.prototype.make_unique = function (){	if (this.constructor.prototype.onshow) {		this.constructor.prototype.onshow.cancel();	}	this.constructor.prototype.onshow = this;}PopupForm.prototype.close_unique = function () {	this.constructor.prototype.onshow = null;}PopupForm.prototype.onshow = null;PopupForm.prototype.create_template = function (params){	//создать пустышку, если шаблон не задан...	if (!this.template)			{		this.template = document.createElement('div');		this.template.className = 'edit-form-container';		this.template.style["background-color"] = "#FFFFFF";		var html = this.title ? '<h3 class="edit-form-title">' + this.escape_text(this.title) + '</h3>' : '';		html += '<div class="mt-input-container"></div><button class="edit-form-ok-btn">ОК</button><button class="edit-form-cancel-btn">Отмена</button>';		this.template.innerHTML = html;					this.template.style["background_color"] ="#FFFFFF";		this.template.style["padding"] = "5px";		this.template.style["box-shadow"] = "0 0 10px rgba(0,0,0,0.5)"; 	}	this.template.style["position"] = "fixed";}PopupForm.prototype.escape_text = function (text){	return text.replace(/'|"/g, '&quot;').replace(/</, '$lt;').replace(/>/, '$gt;');}PopupForm.prototype.init = function(){	var self = this;		self.template.onkeydown =  function(e)	{		switch(e.keyCode)		{			case 27: self.cancel(); break;			case 13: self._ok(); break;		}	}	}PopupForm.prototype.attach_focus = function(){	var self = this;	self.template.on("blur", function (e)	{		self.cancel();	});}PopupForm.prototype.insert = function (){	//вставляем в нужное место документа	this.template.style["display"] = "block";	document.body.appendChild(this.template);		var w = window.innerWidth / 2 - this.template.offsetWidth/2;	var h = window.innerHeight / 2 - this.template.offsetHeight/2;	this.template.style["left"]	= w + "px";	this.template.style["top"] = h + "px";}PopupForm.prototype.detach = function (){	//отсоединить от документа	this.template.parentNode.removeChild(this.template);}PopupForm.prototype.save_text = function (jquery_obj){	//получить редактируемый текст из документа	//this.text = jquery_obj.text();	//jquery_obj.text("");}PopupForm.prototype.show = function (jquery_obj){	this.initialize();		this.make_unique();		this.jquery_obj = jquery_obj;		if (this.change_text && jquery_obj) {		this.save_text(jquery_obj);	}	this.insert();		this.result = -1;	this.form.focus();}PopupForm.prototype.hide = function(){	this.close_unique();		this.detach();		//вставить новый текст или восстановить старый	if (this.change_text && this.jquery_obj) {		//this.jquery_obj.text(this.text);	}}PopupForm.prototype.cancel = function(){	this.hide();}PopupForm.prototype._get_values_from_inputs = function(data, inputs) {	if (!inputs) 		return;	var key;	for(var i = 0; i < inputs.length; i++) {		if (inputs[i].hasAttribute('data-value')) {			key = inputs[i].getAttribute('data-value');			if (inputs[i].type === "checkbox") {				data[key] = !!inputs[i].checked;			}			else if (inputs[i].type == 'text') {				if (!this.not_escape) {					data[key] = this.escape_text(inputs[i].value);				} else {					data[key] = inputs[i].value;				}			}			else {				data[key] = inputs[i].value;			}		}	}}PopupForm.prototype._get_value = function (){	var value;	if (this.type === 'custom') {		value = {};		this._get_values_from_inputs(value, this.form.querySelectorAll('input'));		this._get_values_from_inputs(value, this.form.querySelectorAll('select'));		this._get_values_from_inputs(value, this.form.querySelectorAll('textarea'));	}	else if (this.type === "select") {		//new_value = this.form.find(":selected").val();		value = this.form.options[this.form.selectedIndex].value;		//var text = e.options[e.selectedIndex].text;	} else if (this.type === "text") {		value = this.form.value;		if (!this.not_escape) {			value = this.escape_text(value);		}	}	else if (this.type === 'textarea') {		value = this.form.value;		if (!this.not_escape) {			value = this.escape_text(value);		}	}	return value;}PopupForm.prototype._ok = function(){	value = this._get_value();	this.hide();		if (this.handler) {		var done = this.handler(value);		if (done)		{			this.result = value;			//выбрать новый текст из словаря, если у нас список значений			this.text = this.dict ? this.dict[value] : value;		}	}}function ModalForm(){	PopupForm.apply(this, arguments);}ModalForm.prototype = Object.create(PopupForm.prototype);ModalForm.prototype.constructor = ModalForm;ModalForm.prototype.onShow = null;ModalForm.prototype.create_template = function (params){	if (!this.template)			{		this.template = $('<form class="modal-edit-form-container">');			var html = "";		if (params.title) {			html = '<div class="mt-edit-title"><i><h3>'+params.title+'</h3></i></div>';		}		html += '<div class="modal-edit-form mt-input-container"></div><div><button class="inplace-edit-ok">ОК</button><button class="inplace-edit-cancel">Отмена</button></div>'		this.template.html(html);				this.template.css({"background-color": "#FFFFFF"});		this.template.css({"padding": "5px"});		this.template.css({"box-shadow":  "0 0 10px rgba(0,0,0,0.5)"}); 	}	this.template.css({"position": "absolute"});}ModalForm.prototype.insert = function (){	$(document.body).append(this.template);		//вставляем по центру экрана	this.template.css({"display": "block"});		    this.template.css({        'position': 'fixed',        'left': '50%',        'top': '50%',    });    this.template.css({        'margin-left': -this.template.outerWidth() / 2 + 'px',        'margin-top': -this.template.outerHeight() / 2 + 'px'    });	};
/* FileSaver.js
 * A saveAs() FileSaver implementation.
 * 1.3.2
 * 2016-06-16 18:25:19
 *
 * By Eli Grey, http://eligrey.com
 * License: MIT
 *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
 */

/*global self */
/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

var saveAs = saveAs || (function(view) {
	"use strict";
	// IE <10 is explicitly unsupported
	if (typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
		return;
	}
	var
		  doc = view.document
		  // only get URL when necessary in case Blob.js hasn't overridden it yet
		, get_URL = function() {
			return view.URL || view.webkitURL || view;
		}
		, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
		, can_use_save_link = "download" in save_link
		, click = function(node) {
			var event = new MouseEvent("click");
			node.dispatchEvent(event);
		}
		, is_safari = /constructor/i.test(view.HTMLElement) || view.safari
		, is_chrome_ios =/CriOS\/[\d]+/.test(navigator.userAgent)
		, throw_outside = function(ex) {
			(view.setImmediate || view.setTimeout)(function() {
				throw ex;
			}, 0);
		}
		, force_saveable_type = "application/octet-stream"
		// the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
		, arbitrary_revoke_timeout = 1000 * 40 // in ms
		, revoke = function(file) {
			var revoker = function() {
				if (typeof file === "string") { // file is an object URL
					get_URL().revokeObjectURL(file);
				} else { // file is a File
					file.remove();
				}
			};
			setTimeout(revoker, arbitrary_revoke_timeout);
		}
		, dispatch = function(filesaver, event_types, event) {
			event_types = [].concat(event_types);
			var i = event_types.length;
			while (i--) {
				var listener = filesaver["on" + event_types[i]];
				if (typeof listener === "function") {
					try {
						listener.call(filesaver, event || filesaver);
					} catch (ex) {
						throw_outside(ex);
					}
				}
			}
		}
		, auto_bom = function(blob) {
			// prepend BOM for UTF-8 XML and text/* types (including HTML)
			// note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
			if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
				return new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});
			}
			return blob;
		}
		, FileSaver = function(blob, name, no_auto_bom) {
			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			// First try a.download, then web filesystem, then object URLs
			var
				  filesaver = this
				, type = blob.type
				, force = type === force_saveable_type
				, object_url
				, dispatch_all = function() {
					dispatch(filesaver, "writestart progress write writeend".split(" "));
				}
				// on any filesys errors revert to saving with object URLs
				, fs_error = function() {
					if ((is_chrome_ios || (force && is_safari)) && view.FileReader) {
						// Safari doesn't allow downloading of blob urls
						var reader = new FileReader();
						reader.onloadend = function() {
							var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
							var popup = view.open(url, '_blank');
							if(!popup) view.location.href = url;
							url=undefined; // release reference before dispatching
							filesaver.readyState = filesaver.DONE;
							dispatch_all();
						};
						reader.readAsDataURL(blob);
						filesaver.readyState = filesaver.INIT;
						return;
					}
					// don't create more object URLs than needed
					if (!object_url) {
						object_url = get_URL().createObjectURL(blob);
					}
					if (force) {
						view.location.href = object_url;
					} else {
						var opened = view.open(object_url, "_blank");
						if (!opened) {
							// Apple does not allow window.open, see https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/WorkingwithWindowsandTabs/WorkingwithWindowsandTabs.html
							view.location.href = object_url;
						}
					}
					filesaver.readyState = filesaver.DONE;
					dispatch_all();
					revoke(object_url);
				}
			;
			filesaver.readyState = filesaver.INIT;

			if (can_use_save_link) {
				object_url = get_URL().createObjectURL(blob);
				setTimeout(function() {
					save_link.href = object_url;
					save_link.download = name;
					click(save_link);
					dispatch_all();
					revoke(object_url);
					filesaver.readyState = filesaver.DONE;
				});
				return;
			}

			fs_error();
		}
		, FS_proto = FileSaver.prototype
		, saveAs = function(blob, name, no_auto_bom) {
			return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
		}
	;
	// IE 10+ (native saveAs)
	if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
		return function(blob, name, no_auto_bom) {
			name = name || blob.name || "download";

			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			return navigator.msSaveOrOpenBlob(blob, name);
		};
	}

	FS_proto.abort = function(){};
	FS_proto.readyState = FS_proto.INIT = 0;
	FS_proto.WRITING = 1;
	FS_proto.DONE = 2;

	FS_proto.error =
	FS_proto.onwritestart =
	FS_proto.onprogress =
	FS_proto.onwrite =
	FS_proto.onabort =
	FS_proto.onerror =
	FS_proto.onwriteend =
		null;

	return saveAs;
}(
	   typeof self !== "undefined" && self
	|| typeof window !== "undefined" && window
	|| this.content
));
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window

if (typeof module !== "undefined" && module.exports) {
  module.exports.saveAs = saveAs;
} else if ((typeof define !== "undefined" && define !== null) && (define.amd !== null)) {
  define("FileSaver.js", function() {
    return saveAs;
  });
}
;
/*
Router
*/

function My_Router() 
{
	this.routes = new Array();
}


My_Router.prototype.decode_params = function (arr) 
{
	for(var i = 0; i < arr.length; i++) {
		arr[i] = decodeURIComponent(arr[i]);
	}
}

My_Router.prototype.apply_route = function (params, route)
{
	//remove whole match, left only parenthess groups
	if (params.length > 1) {
		params.splice(0,1);
	}
			
	this.decode_params(params);
		
	route.callback.apply(route.obj, params);
}

My_Router.prototype.test_hash = function (url)
{
	var item, groups;
	for(var i = 0; i < this.routes.length; i++) {
		item = this.routes[i];
		item.re.lastIndex = 0;		
		groups = item.re.exec(url);
		if (groups) {
			this.apply_route(groups, item);
			
			return true;
		}
	}
	
	//if nothing match
	if (this.default_route) {
		this.default_route.callback.apply(this.default_route.obj, [url]);
	}
}

My_Router.prototype.add_default = function (callback, obj) 
{
	this.default_route = {callback: callback, obj: obj};
}

My_Router.prototype._add = function (re, callback, obj)
{
	return this.routes.push({re: re, callback: callback, obj: obj});
}


/*
	lead/:category/:page transform to regexp lead/([^/]+?)/([^/])+?
	without leading '#'!!!
*/
My_Router.prototype.add_route = function (route, callback, obj) 
{
	var frag = route.split("/");
	
	var t = "^";
	var str;
	
	var keys = {};
	var key;
	var index = 0;
	for(var i = 0; i < frag.length; i++) {
		str = frag[i];
		//slash
		if (!str || i > 0) {
			t +="/";
		}
		if (str) {
			//named parameter
			if (str[0] === ":") {
				key = {index: index};
				keys[str.slice(1)] = key;
				index++;
				
				t += "([^/]+?)"
			}
			//literally text fragment
			else {
				t += str;
			}
		}
	}
	t += "$";
	this._add(new RegExp(t), callback, obj);
}

My_Router.prototype.hash_change = function (e)
{
	var hash = window.location.hash;
	if (hash) {
		hash = hash.split("#");
		if (hash.length > 1) {
			hash = hash[1];
		}
		if (hash && hash[0] == "/") {
			hash = hash.slice(1);
		}
	}
	this.test_hash(hash);
}

My_Router.prototype.refresh = function ()
{
	this.hash_change();
}

//by default call route callback without change location
My_Router.prototype.navigate = function (hash, change_location)
{
	if (change_location) {
		var new_hash = "#"+hash;
		if (window.location.hash == new_hash) {
			this.test_hash(hash);
		}
		else {
			window.location.hash = new_hash;
		}
	}
	else {
		this.test_hash(hash);
	}
}

My_Router.prototype.start = function (force_hash_change)
{
	var self = this;
	window.addEventListener("hashchange", function (e) 
	{
		self.hash_change(e);
	}, false);
	
	if (force_hash_change) {
		this.hash_change();
	}
}



;
//consoel.log("run application");


var event_hub;

function Vue_Application(dlink)
{
    //console.log("create vue application", dlink);        
 
    this.create_database(dlink);
}

Vue_Application.prototype = Object.create( Application.prototype );
Vue_Application.prototype.constructor = Vue_Application;

Vue_Application.prototype.initialize = function ()
{
    var self = this;
    
    this.mixin_vue();
    
    //console.log("dynalinks is true?", this.dynalinks.categories["English"] !== undefined);
	this.vue = DAE.create_vue_app(this.dynalinks);
    
    
    //create event hub
	event_hub = DAE.create_event_hub();
    DAE.create_main_menu(this);


	this.init_router();	
	var self = this;
	event_hub.$on("delete-record", function (id) {
		self.remove_item( id );		
	});
    
    
    event_hub.$on("create_category", function (name) {
        self.dynalinks.add_category(name);
    });
    
    event_hub.$on("get_database", function (callback) {
        console.log("get database");
        color_console("get_databse", "blue");
        callback(self.dynalinks);
    });
    
}

Vue_Application.prototype.mixin_vue = function ()
{
    var self = this;
    Vue.mixin({
        created: function () {
            this.$dynalinks= self.dynalinks;
        }
    });
}


Vue_Application.prototype.clear_ls = function ()
{
    delete localStorage["Dynalinks"];
}

Vue_Application.prototype.save_to_ls = function ()
{
    var text = this.dynalinks.toJSON();
    localStorage.setItem("Dynalinks", text);
}

Vue_Application.prototype.add_item = function ()
{
	var context = this.dynalinks.get_active_context();
	if (context) {
		var category = context.category_name;
		mr.navigate('add/'+category, true);
	} else {
		console.log("Error add record! Category not found!", this.dynalinks.category_name);
	}
}



Vue_Application.prototype.show_category_page = 	function (category, page)
{
	if (!category) {
		console.log("Error! Category " + category + " not found!");
        console.log("Either: 1) category " + category + " is wrong");
		this.vue.$emit("my_command", "show_error", "Error! Category " + category + " not found!");
	} else {
        this.dynalinks.set_category(category);
		if (page) {
			this.dynalinks.set_page(page);	
			this.vue.$emit("my_command", "show_page", category, page, this.dynalinks);
		} else {
			var name = this.dynalinks.get_first_page_from_category(category);
			this.dynalinks.set_page(name);				
            this.vue.$emit("my_command", "show_page", category, page, this.dynalinks);
		}
	}
}

Vue_Application.prototype.show_search_result = function (value)
{
	var results = this.dynalinks.search(["text", "href"], value);
	this.search_results = results;
	this.vue.$emit("my_command", "show_search_result", results);
}




Vue_Application.prototype.add_record_to_category = function (category)
{
    if (category !== undefined) {
        var cat = this.dynalinks.categories[category];
        if (!cat) {
            this.vue.$emit("my_command", "show_error", "Category " + category + " not found!");
            return;
        }
    }
	var self = this;

	var message = 
	{
        _id: ''
	};
    
    this.vue.$on("record->update", function (response, record) {
        if (response === 'reject') {
            mr.navigate(self.dynalinks.create_url(category), true);
        }
        else if (response === "accept") {
			var tag = record.tag;
            console.log("record getting ", record);
			mr.navigate(self.dynalinks.create_url(category, tag), true);            
        }
    });
    
	this.vue.$emit("my_command", "update_record", message);    
}

Vue_Application.prototype.add_record_from_browser = function (title, url)
{
    //console.log("add record with " + title + "?>" + url);
	var self = this;

	var message = 
	{
        _id: '',
        text:title,
        href: url,
	};
    
    this.vue.$on("record->update", function (response, record) {
        if (response === 'reject') {
            mr.navigate(self.dynalinks.create_url(category), true);
        }
        else if (response === "accept") {
			var tag = record.tag;
			mr.navigate(self.dynalinks.create_url(category, tag), true);            
        }
    });
    
	this.vue.$emit("my_command", "update_record", message);    
}



Vue_Application.prototype.update_record = function (category, id)
{
	var self = this;
	var context = self.dynalinks.categories[category];
	if (!context) {
		console.log("Error update record!");
		return;
	}
	var record = context.hash[id];
	if (!record) {
		console.log("Error update record!");
		return;
	}
    //fucking 2 way data bindings
    //we need create copy of record that is given to user for editing
    //if user approve editing, then we need update record in database
    //if user reject editing, then we do nothing
    var tag = record.tag;
    var old_favorite = record.favorite;
    var item = create_clone_object(record);    
	self.vue.$emit("my_command", "show_update_form", item, category, function (value ) {
        //context.check_favorite(record, old_favorite);
        self.dynalinks.update_item(record, item);
		mr.navigate(self.dynalinks.create_url(category, value.tag), true);			
	}, 
    //cancel
    function () {			
        mr.navigate(self.dynalinks.create_url(category, tag), true);
    }
    );
}


Vue_Application.prototype.look_tabs = function ()
{
    if (this.port === undefined) {
        this.port = new Portman("tab-manager", true);
        this.port.process_message = function (m)
        {
            //console.log("test_Ojbect: get message from tab-manager =>" + JSON.stringify(m));
            if (m) {
                event_hub.$emit("set->tabinfo", m.tabinfo);
            }
        }
        //console.log("port created");            
    }
    this.port.post({command:"get", info:"alltabinfo"});
    
    this.vue.$emit("my_command", "tab_manager", 'vueTableGrid');
    
}

Vue_Application.prototype.init_router = function ()
{
	var self = this;
	
	mr = new My_Router();	

	mr.add_route("view/:category", this.show_category_page, this);
	mr.add_route("view/:category/:page", this.show_category_page, this);
	
	mr.add_route("update/:category/:id", this.update_record, this);
	mr.add_route("add/:category", this.add_record_to_category, this);
    
    mr.add_route("tabs/all", this.look_tabs, this);
	
		
	mr.add_default( function (url) 
		{
            
            this.vue.$emit("my_command", "show_category", null, this.dynalinks);
		}, this);
		
		
	mr.add_route("search/:value", function (value) {
		self.show_search_result(decodeURIComponent(value));
	}, this);
		
	mr.start(true);	
}


Vue_Application.prototype.create_empty_database = function ()
{
    var database = {
        database: {
        'unknown': []
        },
        names: {'unknown': 'unknown'},
        features: {},
    };
    return database;
}

Vue_Application.prototype.get_database_normal = function ()
{
	var container;
    var database = undefined;
	if (typeof window === 'object') {
		container = window;
	} else if  (typeof global === 'object') {
		container = global;
	}
     
	if (container && container['my_links']) {
        console.log("trying load my_links from global");
		database = container['my_links'];
        if (database !== undefined) {
            console.log("This is done! Data readed from global!", database);
        }
	}
    
    if (database === undefined) {
        console.error("global not contains my_links. Sorry. One attempt leaves.");
    }
    
    if (localStorage["Dynalinks"]) {
        console.log("trying read database from localStorage");
        container.old_my_links = database;
        var text = localStorage["Dynalinks"];
        database = JSON.parse(text);
        if (!!!database) {
            console.error("Sorry, localStorage not contains data");
            database = undefined;
        }
    }

    if (database === undefined) {
        console.log('Error! database is undefined! Created empty database!');
        database = this.create_empty_database();
    }
	return database;
}



Vue_Application.prototype.find_database = function(callback, error)
{
    var self = this;
    if (!this.ITS_EXTENSION || typeof (browser) === 'undefined') {
        fail("this is not extension!");
        return;
    }

    console.log("trying load from browser.local.storage" + this.key_name);
    var request = browser.storage.local.get(this.key_name);
    
    function success(data) 
    {
        console.log("database opened");
        var key_name = data.key_name;
        if (key_name === self.key_name) {
            console.log("this is true database", data);
            callback(data.db);
        } else  {
            fail("is not true database \n Name 'key_name' must be "+self.key_name +"\n However found " + key_name + "\nDump database down \n " + JSON.stringify(data));
        }
    }
    
    function fail(err)
    {
        console.log("failed to read database from browser.storage.local", err);
        error();
    }
    
    request.then(success, fail)

}




