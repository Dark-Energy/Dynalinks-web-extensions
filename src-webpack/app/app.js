﻿
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



